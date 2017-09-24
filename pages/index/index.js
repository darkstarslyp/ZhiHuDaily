//index.js
//获取应用实例
const app = getApp()
var utils = require('../../utils/util.js')

Page({
  data: {
    list:[],
    indicatorDots:true,
    duration: 1000,
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    loading: false,
  },
  bannerDetail: function (view){
     wx.navigateTo({
       url: 'detail/detail?id=' + view.target.dataset.id
     })
  },

  //事件处理函数
  loadMore: function(e) {
    if (this.data.list.length === 0) return
    var that = this
    that.setData({ loading: true })
    var date = that.getNextDate()

    wx.request({
      url: 'http://news.at.zhihu.com/api/4/news/before/' + (Number(utils.formatDate(date))) ,
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.data.stories){
          that.setData({
            list: that.data.list.concat([{ header: utils.formatDate(date, '-') }]).concat(res.data.stories),
          })
        }
        that.setData({
            loading: false,
          })
      },
      fail:function(e){
        that.setData({
          loading: false
        })
      }
    })
  },
  getNextDate: function () {
    var now = new Date()
    now.setDate(now.getDate() - this.index++)
    return now
  },
  onLoad: function () {
    var that = this
    wx.request({
      url: 'http://news-at.zhihu.com/api/4/news/latest',
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        that.setData({
          bannerData: res.data.top_stories,
          list: [{header:'今日热点'}].concat(res.data.stories)  ,
        })
      }
    })
    this.index =1
  },
 
})
