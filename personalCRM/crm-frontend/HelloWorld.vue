<!-- src/components/HelloWorld.vue -->

<template>
  <div class="hello">
    <h1>Customer Management System</h1>
    <form @submit.prevent="addCustomer">
      <input type="text" v-model="name" placeholder="Name" required /><br />
      <input type="email" v-model="email" placeholder="Email" required /><br />
      <input type="tel" v-model="phone" placeholder="Phone" /><br />
      <textarea v-model="notes" placeholder="Notes"></textarea><br />
      <button type="submit">Add Customer</button>
    </form>

    <ul>
      <li v-for="customer in customers" :key="customer._id">
        <div>Name: {{ customer.name }}</div>
        <div>Email: {{ customer.email }}</div>
        <div>Phone: {{ customer.phone }}</div>
        <div>Notes: {{ customer.notes }}</div>
        <button @click="deleteCustomer(customer._id)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'HelloWorld',
  data() {
    return {
      name: '',
      email: '',
      phone: '',
      notes: '',
      customers: [],
    };
  },
  created() {
    this.fetchCustomers();
  },
  methods: {
    async fetchCustomers() {
      try {
        const response = await axios.get('http://localhost:3000/customers');
        this.customers = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async addCustomer() {
      try {
        const newCustomer = {
          name: this.name,
          email: this.email,
          phone: this.phone,
          notes: this.notes,
        };
        await axios.post('http://localhost:3000/customers', newCustomer);
        this.fetchCustomers();
        this.clearForm();
      } catch (error) {
        console.error(error);
      }
    },
    async deleteCustomer(id) {
      try {
        await axios.delete(`http://localhost:3000/customers/${id}`);
        this.fetchCustomers();
      } catch (error) {
        console.error(error);
      }
    },
    clearForm() {
      this.name = '';
      this.email = '';
      this.phone = '';
      this.notes = '';
    },
  },
};
</script>

<style scoped>
h1 {
  color: #42b983;
}
form {
  margin-bottom: 20px;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
}
</style>
