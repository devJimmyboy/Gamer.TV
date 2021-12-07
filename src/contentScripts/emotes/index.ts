import $ from "jquery"
import { EmoteManager } from "./EmoteManager"

const emoteManager = new EmoteManager()

const testEmote = (emote: string) =>
  emoteManager.onReady((bool) =>
    console.log(`${emote}: `, bool ? emoteManager.getEmote(emote)?.url : `Failed to load ${emote}`)
  )

$(() => {
  testEmote("pog")
  testEmote("LULW")
  testEmote("LUL")
  testEmote("4Head")
})
