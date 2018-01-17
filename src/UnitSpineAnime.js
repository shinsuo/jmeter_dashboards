UnitSpineAnime = sp.SkeletonAnimation.extend(/** @lends sp.Skeleton# */{

    init: function () {
        var self = this;
        cc.Node.prototype.init.call(self);
        this._premultipliedAlpha = (cc._renderType === cc.game.RENDER_TYPE_WEBGL && cc.OPTIMIZE_BLEND_FUNC_FOR_PREMULTIPLIED_ALPHA);
        this._blendFunc = { src: cc.BLEND_SRC, dst: cc.BLEND_DST };
        this._ownsAnimationStateData = true;
        this.setAnimationStateData(new spine.AnimationStateData(this._skeleton.data));
    },

    onEnter: function () {
        sp.SkeletonAnimation.prototype.onEnter.call(this);
        if(cc.sys.isNative){
            this.unscheduleUpdate();
        }
    },

    setIsFlipX: function(flip){
        if(cc.sys.isNative){
            //this.getSkeleton().setFlipX(flip);
            this.setFlipX(flip);
        } else{
            this._skeleton.flipX = flip;
        }
    },

    setIsFlipY: function(flip){
        if(cc.sys.isNative){
            this.setFlipY(flip);
        }else{
            this._skeleton.flipY = flip;
        }
    },

 });
 
UnitSpineAnime.create = function (skeletonDataFile, atlasFile/* or atlas*/, scale) {
    return new UnitSpineAnime(skeletonDataFile, atlasFile, scale);
};

UnitSpineAnime.createWithKeyAtlas = function (key) {

    return new UnitSpineAnime("res/downloadfiles/animation/spine/" + key + ".json", "res/downloadfiles/animation/spine/" + key + ".atlas", UnitSpineAnimeDefaultScale);
};
UnitSpineAnime.createWithKeyPlist = function (key) {

    return new UnitSpineAnime("res/downloadfiles/animation/spine/" + key + ".json", "res/downloadfiles/animation/spine/" + key + ".plist", UnitSpineAnimeDefaultScale);
};