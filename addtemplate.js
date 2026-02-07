document.body.innerHTML = `<div id="caturday_banner" class="nodrag">
        <img src="../../assets/images/gifs/whatthesigma.gif" id="caturday_gif1">
        <span id="caturday_text">:(  I don't think you have JavaScript enabled.</span>
        <img src="../../assets/images/gifs/caturday.gif" id="caturday_gif2">
        <img src="../../assets/images/gifs/caturday_sky.gif" id="caturday_gif3">
    </div>
    <div id="top_stuff">
        <div id="juyoh_banner">
            <div class="clickable nodrag">
                <a href="../../index.html">
                    <img id="juyoh_banner_face" src="../../assets/images/icon.png">
                    <div id="juyoh_banner_text">Juyoh's Thingamajicks</div>
                </a>
            </div>
        </div>
        <div id="blog_info">
            <span id="blog_title"></span>
            <span id="blog_created"></span>
        </div>
    </div>
    
    <div id="markdown">
        <div id="content" class="nodrag">
            <div class="js-error">
                <span id="error_text">:(  I don't think you have JavaScript enabled.<p></p> Unfortunately for this page it is needed.</span>
                <img id="error_img" src="../../assets/images/ohno.jpeg">
            </div>
           
        </div>
    </div>
    <div id="legalrubbish_plus_funbadges" style="margin: auto; width: fit-content;">
        <div id="funbadges">
            <img src="/assets/images/gifs/stickers/cookiefree.png">
            <img src="/assets/images/gifs/stickers/bestdesktop.gif">
            <a href="https://consumerrights.wiki/w/Right_to_repair">
                <img src="/assets/images/gifs/stickers/right2repair.png">
            </a>
            <img src="/assets/images/gifs/stickers/catboys.webp">
            <img src="/assets/images/gifs/stickers/autistic.png" style="width: 88px; height: 31px;">
            <a href="https://store.steampowered.com">
                <img src="/assets/images/gifs/stickers/steam.gif">
            </a>
            <img src="/assets/images/gifs/stickers/miku.png">
            <img src="/assets/images/gifs/stickers/trans.png">
            <a href="https://github.com/gorhill/uBlock">
                <img src="/assets/images/gifs/stickers/ublock-origin.webp"> 
            </a>
            <img src="/assets/images/gifs/stickers/linux.png">
            <img src="/assets/images/gifs/stickers/toebeans.gif">
        <a href="/LICENSE.txt" id="legalrubbish" style="display: block; color: inherit;">
            Licensed MIT 2026
        </a>
    </div>`

document.getElementById("blog_title").innerText = document.title