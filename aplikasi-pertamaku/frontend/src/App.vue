<script setup>
import { ref } from 'vue';
import CommentSection from './components/CommentSection.vue';

// Define reactive properties
const userId = ref('');
const user = ref(null); // Changed from 'users' to 'user' as single user is expected
const newEmail = ref('');

const getUser = async () => {
  try {
    const response = await fetch(`http://localhost:4000/api/user/${userId.value}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    user.value = data; // Assign the data to 'user'
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

const changeEmail = async () => {
  try {
    const response = await fetch(`http://localhost:4000/api/user/${userId.value}/change-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: newEmail.value }),
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    // Maybe fetch updated user info after changing email
    await getUser();
    
  } catch (error) {
    console.error('Error changing email:', error);
  }
};
</script>

<template>
  <div id="app">
    <h1>User Dashboard</h1>
    
    <!-- Input for User ID and Get User Button -->
    <div>
      <input v-model="userId" placeholder="Enter User ID" />
      <button @click="getUser">Get User Info</button>
    </div>
    
    <!-- Display User Info -->
    <div v-if="user">
      <h2>{{ user.name }}</h2>
      <p>Email: {{ user.email }}</p>
      <hr />
    </div>
    
    <!-- Comment Section Component -->
    <CommentSection />
    
    <!-- Form for Changing Email -->
    <form @submit.prevent="changeEmail">
      <h3>Change Email</h3>
      <input v-model="newEmail" placeholder="New Email" />
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

