
<template>
    <section id="hero">
        <h1 class="tagline">
            <span class="accent">与光同行</span>
        </h1>
        <p class="description">个人学习笔记 ✍</p>
        <p class="actions">
            <a class="get-started" href="/bookmarks/index">
                书签
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24">
                    <path
                        d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" />
                </svg>
            </a>
        </p>
    </section>
</template>
<style>
:root {
    --vt-c-text-2: rgba(60, 60, 60, .7);
    --vt-c-bg-mute: #f1f1f1;
    --vt-c-text-code: #476582;
    --vt-c-white: #ffffff;
    --vt-c-white-soft: #f9f9f9;
    --vt-c-white-mute: #f1f1f1;
    --vt-c-black: #1a1a1a;
    --vt-c-black-pure: #000000;
    --vt-c-black-soft: #242424;
    --vt-c-black-mute: #2f2f2f;
    --vt-c-indigo: #213547;
    --vt-c-indigo-soft: #476582;
    --vt-c-indigo-light: #aac8e4;
    --vt-c-gray: #8e8e8e;
    --vt-c-gray-light-1: #aeaeae;
    --vt-c-gray-light-2: #c7c7c7;
    --vt-c-gray-light-3: #d1d1d1;
    --vt-c-gray-light-4: #e5e5e5;
    --vt-c-gray-light-5: #f2f2f2;
    --vt-c-gray-dark-1: #636363;
    --vt-c-gray-dark-2: #484848;
    --vt-c-gray-dark-3: #3a3a3a;
    --vt-c-gray-dark-4: #282828;
    --vt-c-gray-dark-5: #202020;
    --vt-c-divider-light-1: rgba(60, 60, 60, .29);
    --vt-c-divider-light-2: rgba(60, 60, 60, .12);
    --vt-c-divider-dark-1: rgba(84, 84, 84, .65);
    --vt-c-divider-dark-2: rgba(84, 84, 84, .48);
    --vt-c-text-light-1: var(--vt-c-indigo);
    --vt-c-text-light-2: rgba(60, 60, 60, .7);
    --vt-c-text-light-3: rgba(60, 60, 60, .33);
    --vt-c-text-light-4: rgba(60, 60, 60, .18);
    --vt-c-text-light-code: var(--vt-c-indigo-soft);
    --vt-c-text-dark-1: rgba(255, 255, 255, .87);
    --vt-c-text-dark-2: rgba(235, 235, 235, .6);
    --vt-c-text-dark-3: rgba(235, 235, 235, .38);
    --vt-c-text-dark-4: rgba(235, 235, 235, .18);
    --vt-c-text-dark-code: var(--vt-c-indigo-light);
    --vt-c-green: #42b883;
    --vt-c-green-light: #42d392;
    --vt-c-green-lighter: #35eb9a;
    --vt-c-green-dark: #33a06f;
    --vt-c-green-darker: #155f3e;
    --vt-c-blue: #3b8eed;
    --vt-c-blue-light: #549ced;
    --vt-c-blue-lighter: #50a2ff;
    --vt-c-blue-dark: #3468a3;
    --vt-c-blue-darker: #255489;
    --vt-c-yellow: #ffc517;
    --vt-c-yellow-light: #ffe417;
    --vt-c-yellow-lighter: #ffff17;
    --vt-c-yellow-dark: #e0ad15;
    --vt-c-yellow-darker: #bc9112;
    --vt-c-red: #ed3c50;
    --vt-c-red-light: #f43771;
    --vt-c-red-lighter: #fd1d7c;
    --vt-c-red-dark: #cd2d3f;
    --vt-c-red-darker: #ab2131;
    --vt-c-purple: #de41e0;
    --vt-c-purple-light: #e936eb;
    --vt-c-purple-lighter: #f616f8;
    --vt-c-purple-dark: #823c83;
    --vt-c-purple-darker: #602960;
}
</style>

<style scoped>
section {
    padding: 42px 32px;
}

#hero {
    padding: 96px 32px;
    text-align: center;
}

.tagline {
    font-size: 76px;
    line-height: 1.25;
    font-weight: 900;
    letter-spacing: -1.5px;
    max-width: 960px;
    margin: 0px auto;
}

html:not(.dark) .accent,
.dark .tagline {
    background: -webkit-linear-gradient(315deg, #42d392 25%, #647eff);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.description {
    max-width: 960px;
    line-height: 1.5;
    color: var(--vt-c-text-2);
    transition: color 0.5s;
    font-size: 22px;
    margin: 24px auto 40px;
}

.actions a {
    font-size: 16px;
    display: inline-block;
    background-color: var(--vt-c-bg-mute);
    padding: 8px 18px;
    font-weight: 500;
    border-radius: 8px;
    transition: background-color 0.5s, color 0.5s;
}

.actions .get-started {
    margin-right: 18px;
}

.actions .icon {
    display: inline;
    position: relative;
    top: -1px;
    margin-left: 2px;
    fill: currentColor;
    transition: transform 0.2s;
}

.actions .get-started:hover {
    transition-duration: 0.2s;
}

.actions .get-started:hover .icon {
    transform: translateX(2px);
}

.actions .get-started {
    color: var(--vt-c-text-code);
}

.actions .get-started:hover {
    background-color: var(--vt-c-gray-light-4);
    transition-duration: 0.2s;
}

.dark .actions .get-started:hover {
    background-color: var(--vt-c-gray-dark-3);
}

.actions .get-started {
    font-size: 16px;
    display: inline-block;
    border-radius: 8px;
    transition: background-color 0.5s, color 0.5s;
    position: relative;
    font-weight: 600;
    background-color: var(--vt-c-green);
    color: #fff;
    margin-right: 18px;
    padding: 8px 1em;
}

.dark .actions .get-started {
    color: var(--vt-c-indigo);
}

.actions .get-started:hover {
    background-color: var(--vt-c-green-dark);
    transition-duration: 0.2s;
}

.dark .actions .get-started:hover {
    background-color: var(--vt-c-green-light);
}

@media (max-width: 960px) {
    .tagline {
        font-size: 64px;
        letter-spacing: -0.5px;
    }

    .description {
        font-size: 18px;
        margin-bottom: 48px;
    }
}

@media (max-width: 768px) {
    .tagline {
        font-size: 48px;
        letter-spacing: -0.5px;
    }
}

@media (max-width: 576px) {
    #hero {
        padding: 64px 32px;
    }

    .description {
        font-size: 16px;
        margin: 18px 0 30px;
    }

    .actions a {
        margin: 0.5em 0;
    }
}

@media (max-width: 370px) {
    .tagline {
        font-size: 36px;
    }
}
</style>