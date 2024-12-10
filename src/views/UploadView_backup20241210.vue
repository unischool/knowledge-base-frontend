<template lang="pug">
  <div>
    .ui.segment
      h1.ui.header 文件管理系統
      .ui.divider

    .ui.segment
      h2.ui.header 索引管理
      .ui.divider
      form.ui.form.container(@submit.prevent="handleSubmit")
        h3.ui.header 建立索引
        input(type="file" @change="handleFileChange" required)
        input(type="password" v-model="password" placeholder="Enter password" required)
        button.ui.primary.button(type="submit") 建立
      .ui.divider
      form.ui.form.container(@submit.prevent="handleSubmit")
        h3.ui.header 刪除索引
        input(type="file" @change="handleFileChange" required)
        input(type="password" v-model="password" placeholder="Enter password" required)
        button.ui.negative.button(type="submit") 刪除

    .ui.segment
      h2.ui.header R2文件存儲和向量化
      .ui.divider
      form.ui.form.container(@submit.prevent="handleSubmit")
        h3.ui.header 從Google drive上傳文件到R2
        input(type="file" @change="handleFileChange" required)
        input(type="password" v-model="password" placeholder="Enter password" required)
        button.ui.blue.button(type="submit") 上傳至 R2
      .ui.divider
      form.ui.form.container(@submit.prevent="handleSubmit")
        h3.ui.header 將R2文件向量化
        input(type="file" @change="handleFileChange" required)
        input(type="password" v-model="password" placeholder="Enter password" required)
        button.ui.yellow.button(type="submit") R2文件向量化

    .ui.segment
      h2.ui.header D1文件存儲
      .ui.divider
      form.ui.form.container(@submit.prevent="handleSubmit")
        h3.ui.header 上傳文件到D1
        input(type="file" @change="handleFileChange" required)
        input(type="password" v-model="password" placeholder="Enter password" required)
        button.ui.orange.button(type="submit") 上傳文件到D1

    .ui.dimmer.active(v-if="uploading")
      .ui.loader
  </div>
</template>

<script>

import axios from 'axios'

export default {
  data() {
    return {
      file: null,
      password: '',
      uploading: false
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
        this.uploading = true;
        const response = await axios.post('https://knowledge-base-backend.leechiuhui.workers.dev/write_file', formData);

        if (response.status === 200) {
          alert('File uploaded successfully!');
          this.uploading = false;
          this.$emit('fileUploaded');
        } else {
          alert('Failed to upload file.');
          this.uploading = false;
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('An error occurred while uploading the file.');
        this.uploading = false;
      }
    }
  }
};
</script>

<style scoped>
.ui.segment {
  margin: 2em 0;
}

.ui.form {
  margin-bottom: 2em;
}

.ui.button {
  margin-top: 1em;
}

input {
  margin-bottom: 1em;
}
</style>
