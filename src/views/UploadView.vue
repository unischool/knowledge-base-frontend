<template lang="pug">
  <div>
    form.ui.form.container(@submit.prevent="handleSubmit")
      h2.ui.header 上傳文件到知識庫
      input(type="file" @change="handleFileChange" required)
      input(type="password" v-model="password" placeholder="Enter password" required)
      button.ui.button(type="submit") Upload
  </div>
</template>

<script>

import axios from 'axios'

export default {
  data() {
    return {
      file: null,
      password: ''
    };
  },
  methods: {
    async handleFileChange(event) {
      this.file = event.target.files[0];
      if (!this.file) {
        alert('No file selected.');
        return;
      }
      
    },

    async handleSubmit() {
      if (!this.file || !this.password) {
        alert('Please select a file and enter a password.');
        return;
      }

      const formData = new FormData();
      formData.append('file', this.file);
      formData.append('password', this.password);
      formData.append('filename', this.file.name);
      formData.append('type', this.file.type);

      try {
        const response = await axios.post('https://knowledge-base-backend.leechiuhui.workers.dev/write_file', formData);

        if (response.status === 200) {
          alert('File uploaded successfully!');
          this.$emit('fileUploaded');
        } else {
          alert('Failed to upload file.');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('An error occurred while uploading the file.');
      }
    }
  }
};
</script>
