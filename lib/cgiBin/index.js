export default class CgiBin {
  constructor (core) {
    this.core = core
  }
  // 获取小程序全局唯一后台接口调用凭据（access_token）
  getAccessToken () {
    const query = {
      corpid: this.core.config.corpid,
      corpsecret: this.core.config.secret
    }
    const url = '/cgi-bin/gettoken'
    return this.core.ajaxAsync({
      url: this.core.uri + url,
      method: 'GET',
      params: query
    })
  }
  async sendMessage (params) {
    await this.core.getToken()
    const query = {
      access_token: this.core.accessToken
    }
    const url = '/cgi-bin/message/send'
    return this.core.ajaxAsync({
      url: this.core.uri + url,
      method: 'POST',
      params: query,
      data: {
        agentid: this.core.config.agentid,
        ...params
      }
    })
  }

  async tagList (params) {
    await this.core.getToken()
    const query = {
      access_token: this.core.accessToken
    }
    const url = '/cgi-bin/tag/list'
    return this.core.ajaxAsync({
      url: this.core.uri + url,
      method: 'GET',
      params: query
    })
  }
}
