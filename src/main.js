// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import InfiniteLoading from 'vue-infinite-loading';

Vue.use(InfiniteLoading);






Vue.config.productionTip = false
Vue.use(ElementUI);

Vue.prototype.getFetch = function getFetch(url, accessToken) {

  return fetch(new Request(url, {
    method: 'get',
    headers: {
      'Authorization': accessToken
    }
  })).then(response => {
    return response.json().then(data => {
      if (data.code == "A020") {
        console.log("receive new accessToken");
        //console.log(localStorage.getItem('user'));
        const user = JSON.parse(localStorage.getItem('user'));
        user.accessToken = data.data;
        localStorage.setItem('user', JSON.stringify(user));
        return getFetch(url, data.data);
      } else {
        return data;
      }
    })
  })
}

Vue.prototype.postFetch = function postFetch(url, accessToken, body) {

  return fetch(new Request(url, {
    method: 'post',
    headers: {
      'Authorization': accessToken,
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(body)
  })).then(response => {
    return response.json().then(data => {
      if (data.code == "A020") {
        console.log("receive new accessToken");
        //console.log(localStorage.getItem('user'));
        const user = JSON.parse(localStorage.getItem('user'));
        user.accessToken = data.data;
        localStorage.setItem('user', JSON.stringify(user));

        return postFetch(url, data.data, body);
      } else {
        return data;
      }
    })
  })
}

Vue.prototype.Fetch = function Fetch(url, accessToken, body,method) {

  return fetch(new Request(url, {
    method: method,
    headers: {
      'Authorization': accessToken,
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(body)
  })).then(response => {
    return response.json().then(data => {
      if (data.code == "A020") {
        console.log("receive new accessToken");
        //console.log(localStorage.getItem('user'));
        const user = JSON.parse(localStorage.getItem('user'));
        user.accessToken = data.data;
        localStorage.setItem('user', JSON.stringify(user));

        return Fetch(url, data.data, body,method);
      } else {
        return data;
      }
    })
  })
}



/* eslint-disable no-new */
new Vue({
  el: '#app',

  router,
  components: { App },
  template: '<App/>'
})




