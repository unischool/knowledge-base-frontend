import './assets/main.css'
import 'semantic-ui-css/semantic.min.css';
import SemanticUIVue from 'semantic-ui-vue';

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)
app.use(SemanticUIVue);
app.mount('#app')

