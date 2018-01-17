
var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        /////////////////////////////
        // 3. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        // var helloLabel = new cc.LabelTTF("Hello World", "Arial", 38);
        // // position the label on the center of the screen
        // helloLabel.x = size.width / 2;
        // helloLabel.y = size.height / 2 + 200;
        // // add the label as a child to this layer
        // this.addChild(helloLabel, 5);

        // // add "HelloWorld" splash screen"
        this.sprite = new cc.Sprite(res.HelloWorld_png);
        this.sprite.attr({
            x: size.width / 2,
            y: size.height / 2
        });
        this.addChild(this.sprite, 0);

        var spine_name_arrs = ["unit_anime_1610105"
        ,"unit_anime_1121"
        ,"unit_anime_1122"
        ,"unit_anime_1123"
        ,"unit_anime_1124"
        ,"unit_anime_1125"
        ,"unit_anime_1126"];
        var count = 1;
        var scale = 0.2;
        for (let index = 0; index < spine_name_arrs.length; index++) {
            const element = spine_name_arrs[index];
            cc.log(element);

            for (let i2 = 0; i2 < count; i2++) {
                var spine1 = new sp.SkeletonAnimation("res/"+element+".json","res/"+element+".atlas", scale);
                spine1.attr({
                    x: size.width / 2,
                    y: size.height / 2
                });
                this.addChild(spine1,9999);
                spine1.setAnimation(0,"attack",true);
            }
            
        }
        cc.log("element");
        return true;
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

