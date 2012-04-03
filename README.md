Info
----
Tint your images in ImpactJS on the client side. Uses the 'multiply' blending mode to colourize each pixel.

![example](https://github.com/deakster/impact-imageblender/raw/master/example.png)

Usage
-----

- Copy imageblender.js into your lib/game folder
- In your game's module, add an entry to the require section for the module 'game.imageblender'
- Append *#hexcolor* to the path in any ig.Image or ig.AnimationSheet. For example, rather than loading 'media/monster.png' you can change it to 'media/monster.png#FF0000' to tint it red.

