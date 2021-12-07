import axios from "axios"
import twitchEmotes from "./twitchGlobals"

export class EmoteManager {
  static apiURLS = {
    ffz: "https://api.frankerfacez.com/v1",
    bttv: "https://api.betterttv.net/3",
    stv: "https://api.7tv.app/v2",
  }
  // static cdnURLS = {
  //   ffz: (type: "emote" | "badge" | "" = "emote") => `https://api.frankerfacez.com/v1/`,
  //   bttv: "https://cdn.betterttv.net/emote/",
  //   stv: "https://cdn.7tv.app/",
  // }
  private emotes: Map<string, Emote> = new Map()
  private loaded: Promise<boolean | void>

  onReady(handler: (e: boolean) => any) {
    this.loaded.then((bool) => handler(bool || false)).catch((e) => console.error(e))
  }
  constructor(loadOnInit = true) {
    // if (import.meta.env.DEV) {
    //   window.axios = axios
    // }
    if (loadOnInit) this.loaded = this.loadEmotes()
    this.loaded = Promise.resolve(false)
  }

  public async loadEmotes(channel: string | undefined = undefined) {
    this.loaded = this.emoteLoad(channel)
      .then((bool) => (bool ? console.log("Emotes loaded") : console.error("Emotes failed to load")))
      .catch((e) => console.error(e))
  }

  public logEmotes() {
    for (let e of this.emotes.values()) {
      console.log(e.name)
    }
  }

  private async emoteLoad(channel: string | undefined) {
    let emotes
    try {
      emotes = {
        ffz: {
          global: (await axios.get(`${EmoteManager.apiURLS.ffz}/set/3`).catch((e) => console.error(e)))?.data.set
            .emoticons,
        },
        bttv: {
          global: (await axios.get(`${EmoteManager.apiURLS.bttv}/cached/emotes/global`).catch((e) => console.error(e)))
            ?.data,
        },
        "7tv": {
          global: (await axios.get(`${EmoteManager.apiURLS.stv}/emotes/global`).catch((e) => console.error(e)))?.data,
        },
        twitch: { global: twitchEmotes },
      } as { "7tv": Provider; ffz: Provider; bttv: Provider; twitch: Provider }
      // window._manager = this
    } catch (e) {
      console.error(e)
      return false
    }

    if (channel) {
    }
    for (let provider of Object.keys(emotes) as ["7tv", "ffz", "bttv", "twitch"]) {
      if (!emotes[provider].global)
        console.error("Loading emotes from " + provider + ` failed.\nemotes[${provider}] is undefined`)
      else
        for (let emote of emotes[provider].global) {
          let e = this.formatEmote(emote, provider)
          this.emotes.set(e.name, e)
        }
    }
    return true
  }
  private formatEmote(emote: any, provider: "7tv" | "ffz" | "bttv" | "twitch"): Emote {
    let formatted: undefined | Emote
    let qual
    switch (provider) {
      case "7tv":
        qual = emote.urls.length
        formatted = {
          name: emote.name,
          provider: provider,
          url: emote.urls[qual - 1] || emote.urls[qual - 2] || emote.urls[qual - 3] || emote.urls[qual - 4],
          style: { height: emote.height[qual - 1], width: emote.width[qual - 1] },
        }
        break
      case "ffz":
        formatted = {
          name: emote.name,
          provider: provider,
          url: `https:${emote.urls["4"] || emote.urls["2"] || emote.urls["1"]}`,
          style: { height: emote.height, width: emote.width },
        }
        break
      case "bttv":
        formatted = {
          name: emote.code,
          provider: provider,
          url: `https://cdn.betterttv.net/emote/${emote.id}/3x`,
          style: { height: 112, width: 112 },
        }
        break
      case "twitch":
        const prefix = (quality: number) => `url_${quality === 3 ? 4 : quality - 1}x`
        qual = Object.keys(emote.images).length
        while (emote.images[prefix(qual)] === undefined && qual > 1) qual--
        formatted = {
          name: emote.name,
          provider: provider,
          url: emote.images[prefix(qual)],
          style: { height: [28, 56, 0, 112][qual], width: [28, 56, 0, 112][qual] },
        }
        break
    }
    return formatted
  }
  public getEmote(name: string): Emote | undefined {
    return this.emotes.get(name)
  }
}

export type Emote = {
  name: string
  url: string
  provider: string
  style: {
    [key: string]: any
  }
}
export type Provider = { [key: string]: any[] }
