from flask import Blueprint, render_template, flash, redirect, url_for, request
from flask_login import current_user, login_user, logout_user, login_required
from app import db
from app.models import User, Medicine
from app.forms import LoginForm, RegistrationForm, MedicineForm

bp = Blueprint('main', __name__)

@bp.route('/')
@bp.route('/index')
def index():
    return render_template('index.html')

@bp.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('main.index'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user is None or not user.check_password(form.password.data):
            flash('Invalid username or password')
            return redirect(url_for('main.login'))
        login_user(user, remember=form.remember_me.data)
        return redirect(url_for('main.index'))
    return render_template('login.html', title='Sign In', form=form)

@bp.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('main.index'))

@bp.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('main.index'))
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(username=form.username.data, email=form.email.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash('Congratulations, you are now a registered user!')
        return redirect(url_for('main.login'))
    return render_template('register.html', title='Register', form=form)

@bp.route('/account', methods=['GET', 'POST'])
@login_required
def account():
    form = MedicineForm()
    if form.validate_on_submit():
        medicine = Medicine(name=form.name.data, dosage=form.dosage.data, frequency=form.frequency.data, user=current_user)
        db.session.add(medicine)
        db.session.commit()
        flash('Your medicine has been added.')
        return redirect(url_for('main.account'))
    medicines = current_user.medicines
    return render_template('account.html', title='Account', form=form, medicines=medicines)

@bp.route('/edit_medicine/<int:id>', methods=['GET', 'POST'])
@login_required
def edit_medicine(id):
    medicine = Medicine.query.get_or_404(id)
    if medicine.user != current_user:
        flash('You do not have permission to edit this medicine.')
        return redirect(url_for('main.account'))
    form = MedicineForm()
    if form.validate_on_submit():
        medicine.name = form.name.data
        medicine.dosage = form.dosage.data
        medicine.frequency = form.frequency.data
        db.session.commit()
        flash('Your medicine has been updated.')
        return redirect(url_for('main.account'))
    elif request.method == 'GET':
        form.name.data = medicine.name
        form.dosage.data = medicine.dosage
        form.frequency.data = medicine.frequency
    return render_template('edit_medicine.html', title='Edit Medicine', form=form)

@bp.route('/delete_medicine/<int:id>', methods=['POST'])
@login_required
def delete_medicine(id):
    medicine = Medicine.query.get_or_404(id)
    if medicine.user != current_user:
        flash('You do not have permission to delete this medicine.')
        return redirect(url_for('main.account'))
    db.session.delete(medicine)
    db.session.commit()
    flash('Your medicine has been deleted.')
    return redirect(url_for('main.account'))
