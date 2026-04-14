// ==UserScript==

// @name         Chzzk P2P Bypass

// @version      2025-09-11

// @author       cyberpsycho

// @match        https://chzzk.naver.com/*

// @match        https://*.chzzk.naver.com/*

// @grant        none

// @require      https://unpkg.com/xhook@latest/dist/xhook.min.js

// ==/UserScript==



(function () {

    'use strict';



    console.log("[Chzzk Bypass] Script loaded");



    xhook.after(function (req, res) {

        if (req.url.includes("live-detail")) {

            try {

                let data = JSON.parse(res.text);



                if (data.content && data.content.p2pQuality) {

                    console.log("[Chzzk Bypass] Removing p2pQuality");

                    data.content.p2pQuality = [];

                    Object.defineProperty(data.content, "p2pQuality", {

                        configurable: false,

                        writable: false

                    });

                }



                if (data.content && data.content.livePlaybackJson) {

                    let playback = JSON.parse(data.content.livePlaybackJson);



                    if (playback.meta && playback.meta.p2p) {

                        console.log("[Chzzk Bypass] Disabling playback.meta.p2p");

                        playback.meta.p2p = false;

                    }



                    if (Array.isArray(playback.media)) {

                        playback.media.forEach(m => {

                            if (Array.isArray(m.encodingTrack)) {

                                m.encodingTrack.forEach(track => {

                                    if (track.p2pPath) {

                                        console.log("[Chzzk Bypass] Removing p2pPath from track:", track.name);

                                        delete track.p2pPath;

                                    }

                                    if (track.p2pPathUrlEncoding) {

                                        delete track.p2pPathUrlEncoding;

                                    }

                                });

                            }

                        });

                    }



                    data.content.livePlaybackJson = JSON.stringify(playback);

                }



                res.text = JSON.stringify(data);

            } catch (err) {

                console.error("[Chzzk Bypass] Error:", err);

            }

        }

    });

})();