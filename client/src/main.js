import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import mixins from "./mixins";

createApp(App)
    .use(router)
    .mixin(mixins)
    .mount("#app");
