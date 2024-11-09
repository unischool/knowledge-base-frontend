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
      password: '',
      keywords: ''
    };
  },
  methods: {
    async handleFileChange(event) {
      this.file = event.target.files[0];
      if (!this.file) {
        alert('No file selected.');
        return;
      }
      try {
        const response = await axios.get('https://knowledge-base-backend.leechiuhui.workers.dev/generate_keywords_by_file/');
        this.keywords = response.data;
      } catch (error) {
        console.error('Error fetching keywords:', error);
        alert('An error occurred while fetching keywords.');
      }
    },

    async handleSubmit() {
      if (!this.file || !this.password) {
        alert('Please select a file and enter a password.');
        return;
      }

      if (!this.keywords) {
        alert('No keywords found. Please try again.');
        return;
      }

      const formData = new FormData();
      formData.append('file', this.file);
      formData.append('password', this.password);
      formData.append('fileName', this.file.name);
      formData.append('fileType', this.file.type);
      formData.append('keywords', this.keywords);

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
