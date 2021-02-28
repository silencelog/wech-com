'use strict'

import axios from 'axios'
import CgiBin from '../cgiBin'

const pg = require('../../package.json')
const request = axios

export default class Core {
  constructor (opt) {
    console.log('constructor', opt)
    this.config = Object.assign({
      corpid: '',
      secret: '',
      agentid: '',
      // msg_signature: '',
      // timestamp: null,
      // nonce: '',
      // echostr: '',
      // // 商户id(如需支付，请设置)
      // mch_id: '',
      // // 小程序API网关地址
      // domain: '',
      // // 小程序支付网关地址
      // paydomain: '',
      // // 支付的商户key
      // paykey: '',
      // // 支付商户证书.p12的路径(若要调用退款,请设置此路径)
      // refundCAPath: ''
    }, opt)
    // 设置token方法接收Promise
    this.setToken = opt.setToken || null
    // token值
    this.accessToken = ''
    // token刷新间隔
    this.accessTokenTiming = 120 * 60 * 60 * 1000 + 1
    // token最后刷新时间
    this.tokenUpdateAt = new Date().getTime()
    // 会话存储key: openid
    this.sessionKeyMap = {}
    this.uri = opt.uri || 'https://qyapi.weixin.qq.com'
    this.version = pg.version
    this.debug = !!opt.debug
    console.log('constructor', this.config)
  }

  async getToken () {
    console.log('getToken: ', this.setToken)
    if (this.setToken) {
      this.accessToken = await this.setToken
    } else if (!this.accessToken || this.tokenUpdateAt + this.accessTokenTiming < new Date().getTime()) {
      const res = await this.cgiBin.getAccessToken()
      this.log('getToken: ', res)
      this.accessToken = res.access_token
    }
    return this.accessToken
  }

  log () {
    if (this.debug) {
      console.log(...arguments)
    }
  }

  async ajaxAsync (req) {
    console.error('req', req)
    const res = await request(req)
    return res.data
  }

  init () {
    this.cgiBin = new CgiBin(this)
    return this
  }
}
