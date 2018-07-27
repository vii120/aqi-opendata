Vue.component('opendata', {
  template: '#cardOutput',
  props: ['aqiData'],
  methods: {
    statusClass: function(status){
      switch (status){
        case '良好': return 'status-aqi1'; break;
        case '普通': return 'status-aqi2'; break;
        case '對敏感族群不健康': return 'status-aqi3'; break;
        case '對所有族群不健康': return 'status-aqi4'; break;
        case '非常不健康': return 'status-aqi5'; break;
        case '危害': return 'status-aqi6';
      }
    },
    starChange: function(){
      this.aqiData.starStatus=!this.aqiData.starStatus;
      this.$emit( 'star', this.aqiData );
    }
  }
})

var app = new Vue({
  el: '#app',
  data: {
    data: [],
    location: [],
    stared: [],
    filter: '',
    exStatus: ['良好','普通','對敏感族群不健康',
    '對所有族群不健康','非常不健康','危害',],
  },
  methods: {
    getData() {
      const vm = this;
      const api = 'http://opendata2.epa.gov.tw/AQI.json';
      $.get(api).then(function( response ) {
        vm.data = response;
        //add starStatus to each object
        vm.data.forEach(function(item){
          if (vm.stared.includes(item.SiteName)){
            vm.$set(item, 'starStatus', true)
          } else {
            vm.$set(item, 'starStatus', false)
          }
        });
        //county filter
        response.forEach(function(item){
          if (!vm.location.includes(item.County)){
            vm.location.push(item.County)
          }
        });
      });
      //localStorage
      if (localStorage.stared!==undefined){
        this.stared = localStorage.getItem("stared").split(",");
      }
    },
    //create star array (only save "site name")
    starArray(item) {
      if (!this.stared.includes(item.SiteName)){
        this.stared.push(item.SiteName);
      } else {
        this.stared.splice(this.stared.indexOf(item.SiteName),1);
      }
      localStorage.setItem("stared", this.stared);
    },
    //clear all stars
    clearStar() {
      const vm = this;
      vm.stared = [];
      vm.data.forEach(function(item){
        item.starStatus = false
      })
      localStorage.clear();
    },
  },
  computed: {
    //filt county
    filtData(){
      var vm = this;
      if (vm.filter == ''){
        return this.data
      } else {
        return vm.data.filter(function(item){
          return item.County == vm.filter;
        })
      }
    },
    //show stared item details
    starData() {
      var tempdata = [];
      const vm = this;
      vm.data.forEach(function(item){
        if (vm.stared.includes(item.SiteName)){
          tempdata.push(item);
        }
      })
      return tempdata
    }
  },
  mounted(){
    this.getData();
  }
});