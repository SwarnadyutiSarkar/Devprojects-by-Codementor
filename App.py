from flask import Flask, request, jsonify, send_file
from flask_celery import Celery
from PIL import Image
import os

app = Flask(__name__)
app.config['CELERY_BROKER_URL'] = 'amqp://guest:guest@localhost:5672//'
app.config['CELERY_RESULT_BACKEND'] = 'rpc://'

celery = Celery(app.name, broker=app.config['CELERY_BROKER_URL'])
celery.conf.update(app.config)

@celery.task
def resize_images(task_id, images):
    for image in images:
        img = Image.open(image)
        width, height = img.size
        if width > height:
            new_width = 800
            new_height = int(height * new_width / width)
        else:
            new_height = 800
            new_width = int(width * new_height / height)
        img = img.resize((new_width, new_height))
        img.save(image)

@celery.task
def combine_images(task_id, images, border_size, border_color):
    widths, heights = zip(*(i.size for i in [Image.open(image) for image in images]))
    total_width = sum(widths)
    max_height = max(heights)
    new_im = Image.new('RGB', (total_width + border_size * (len(images) - 1), max_height + border_size * 2), border_color)
    x_offset = border_size
    for im in [Image.open(image) for image in images]:
        new_im.paste(im, (x_offset, border_size))
        x_offset += im.size[0] + border_size
    new_im.save('collage.jpg')

@app.route('/create_task', methods=['POST'])
def create_task():
    images = request.json['images']
    border_size = request.json['border_size']
    border_color = request.json['border_color']
    task_id = celery.send_task('resize_images', args=[images])
    return jsonify({'task_id': task_id})

@app.route('/get_status', methods=['GET'])
def get_status():
    task_id = request.args.get('task_id')
    task = celery.AsyncResult(task_id)
    if task.status == 'uccess':
        return jsonify({'status': 'uccess', 'collage_id': task.result})
    else:
        return jsonify({'status': 'in_progress'})

@app.route('/get_collage', methods=['GET'])
def get_collage():
    collage_id = request.args.get('collage_id')
    return send_file('collage.jpg', mimetype='image/jpeg')

if __name__ == '__main__':
    app.run(debug=True)