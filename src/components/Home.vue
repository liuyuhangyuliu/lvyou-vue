<template>

  <el-row>
    <el-col :span="14" :offset="2">
      <el-card :body-style="{ padding: '25px' }" v-for="schedule in schedules" :key="schedule.scheduleId">

        <el-row class="card-header">
          <el-col>
            <el-avatar :src="schedule.userBO.avatarSrc"></el-avatar>
            <span id="username"
              style="position:absolute;margin-left:10px;font-size: 16px;font-weight: bold;font-family: 'Courier New', Courier, monospace;">
              {{ schedule.userBO.username }}
            </span>
          </el-col>
        </el-row>
        <el-row class="card-image" v-show=" schedule.images !== '{}'">
          <el-col>

            <div class="block">
              <el-carousel trigger="click" indicator-position="none" :autoplay=false>
                <el-carousel-item v-for="(value,  index) in JSON.parse(schedule.images)" :key="index">
                  <div style="height: 100%;"><img style="height: 100%;" :src="value" alt=""></div>

                </el-carousel-item>
              </el-carousel>
            </div>
          </el-col>

        </el-row>
        <el-row class="card-content">
          <el-row
            style="line-height: 34px;margin-top: 10px;margin-bottom:10px;text-align: justify;font-size: large;font-weight: bold;">
            <el-col :span="6"><router-link
                :to="{ path: `/detail/${schedule.scheduleId}` }">{{ schedule.title }}</router-link></el-col>
            <el-col :span="10" :push="8" style="position: relative;top: 25px;">
              <el-tag>{{schedule.maxNumber}}人</el-tag>
              <el-tag>{{schedule.departAt.toString().replace("T", ' ')}}出发</el-tag>
              <el-tag type="success" v-if="schedule.state === 'OPEN'">开放</el-tag>
              <el-tag type="danger" v-if="schedule.state === 'CLOSE'">关闭</el-tag>
            </el-col>

          </el-row>
          <el-row style="line-height: 16px;text-align: justify;font-family: 'Courier New', Courier, monospace;">
            {{ schedule.description }}
          </el-row>
        </el-row>

      </el-card>
      <infinite-loading @infinite="infiniteHandler"></infinite-loading>

    </el-col>

  </el-row>

</template>

<script>


export default {



  name: 'Home',
  data() {
    return {
      page: 2,
      schedules: [{
        schedule: {
          images: {}
        }
      }],

    }
  },
  //TODO 详情页里后但返回的是schedule，没有用户名和头像
  //要么后端改 要么前端把信息传到后端
  methods: {

    infiniteHandler($state){
      const user = JSON.parse(localStorage.getItem('user'))
    const token = user.accessToken;
      this.getFetch("/api/schedule?page=" + this.page,token)
      .then((data) => {
        if(data.data.length){
          this.page += 1;
          this.schedules.push(...data.data);
          $state.loaded();
        }else{
          $state.complete();
        }
      })

    }
  },
  mounted() {

    function fetchData(accessToken) {

      return fetch(new Request('/api/schedule?page=1', {
        method: 'get',
        headers: {
          'Authorization': accessToken
        }
      })).then(response => {
        return response.json().then(data => {
          if (data.code == "A020") {
            console.log("receive new accessToken");
            return fetchData(data.data);
          } else {
            return data;
          }
        })
      })
    }


    const user = JSON.parse(localStorage.getItem('user'))
    const token = user.accessToken;
    //const token1 = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwianRpIjoiYjBhODgyOTQtODE2My00ODNmLWI0ODEtOWY0ZDUyMWNiMmZmIiwiZXhwIjoxNzE3NjU3NDc2LCJpYXQiOjE3MTc2NTU2NzYsImlzcyI6ImxpdXl1aGFuZyJ9.MZojM3_aJnDx5KkC7dIRuw8-MAmr0XOO6sHkLrqIun0'
    fetchData(token)
      .then(data => {
        this.schedules = data.data;

        //console.log(data);
      });

    //data.data 刚开始没写 我还奇怪数据库就两条数据，为什么给我渲染了三条
    //刚开始用的axios，但是不知道为什么报跨域的错误，我后端已经配置了
    //然后试了一下fetch可以，不过我fetch写的是127.0.0.1,axios写的是localhost是这个原因吗？
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.el-tag{
  margin-right: 4px;
}

.card-header {
  line-height: 50px;
  text-align: justify;
  border-bottom-color: #e2dede;
  border-bottom-width: 0.8px;
  border-bottom-style: solid;
}

.el-card {
  /* height: 500px; */
  margin-bottom: 50px;
}
.el-card-no_image{
  height: 200px;
  margin-bottom: 50px;
}

.card-image {
  line-height: 350px;
  padding-top: 10px;
  padding-bottom: 10px;
  border-bottom-color: #e2dede;
  border-bottom-width: 0.8px;
  border-bottom-style: solid;
}

.card-content {
  line-height: 80px;
}

.el-carousel__item {
  opacity: 1.0;
  margin: 0;

}
</style>