// ==UserScript==
// @name         Chzzk 자동 넓은 화면 + 채팅 닫기
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  치지직 라이브 및 이어보기 영상에서 자동 넓은 화면 전환과 채팅창 닫기
// @match        https://chzzk.naver.com/*
// @icon         https://chzzk.naver.com/favicon.ico
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // 라이브(/live/) 또는 이어보기(/video/) 페이지 판별
    function isTargetPage() {
        return /^\/(live|video)\/[a-zA-Z0-9]+/.test(window.location.pathname);
    }

    // 채팅 닫기 버튼 클릭 함수
    function closeChat() {
        // 라이브 채팅 닫기 버튼 (aria-label 기준)
        const liveChatBtn = document.querySelector('button[aria-label*="채팅 접기"], button[aria-label*="채팅 숨기기"]');
        if (liveChatBtn && liveChatBtn.offsetParent !== null) liveChatBtn.click();

        // 다시보기 채팅 닫기 버튼 (#aside-chatting 내부 경로 기준)
        const replayChatCloseBtn = document.querySelector("#aside-chatting > div > div.vod_chatting_header__b2YCJ > button");
        if (replayChatCloseBtn && replayChatCloseBtn.offsetParent !== null) replayChatCloseBtn.click();
    }

    // 넓은 화면 버튼 클릭 함수 (aria-label 또는 버튼 텍스트에 '넓은 화면' 포함)
    function setWideScreen() {
        if (!isTargetPage()) return;

        const buttons = Array.from(document.querySelectorAll('button')).filter(btn => {
            if (btn.disabled) return false;
            const label = btn.getAttribute('aria-label') || '';
            const text = btn.innerText || '';
            return label.includes('넓은 화면') || text.includes('넓은 화면');
        });

        buttons.forEach(btn => {
            // 이미 활성화 상태가 아니면 클릭
            if (!btn.classList.contains('selected') && btn.getAttribute('aria-pressed') !== 'true') {
                btn.click();
            }
        });

        // 채팅 닫기 버튼 클릭 (두 번 호출로 안정성 강화)
        closeChat();
        setTimeout(closeChat, 700);
    }

    // URL 변경 감지 후 동작
    function onUrlChange() {
        if (isTargetPage()) setTimeout(setWideScreen, 700);
    }

    // 최초 진입 시 실행 대기
    if (isTargetPage()) setTimeout(setWideScreen, 1000);

    // SPA 방식 URL 변경 감지
    let lastUrl = location.href;
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            onUrlChange();
        }
    }, 1000);

})();
