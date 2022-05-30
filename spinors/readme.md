My take on [this lovely spinor animation on wikipedia](https://en.wikipedia.org/wiki/File:Belt_Trick.ogv).

The way it works is we draw a time dependent path $M(r,t) \in SO(3)$ with $M(1,t) = 1$ and $M(0,t)$ a rotation around a fixed axis with angle proportional to $t$. At time $t$ we apply $M(r,t)$ to the sphere of radius $r$. So long as $M(r,t)$ is smooth we'll have a smooth animation, and because each sphere is just rotating, there will be no collisions or tangles.

The particular path I choose can be most easily expressed in terms of un-normalized quaternions (with basis $X,Y,Z$)

$$(1-s + s \sin(t)) X + s \cos(t) Y + w s(1-s) Z$$

where

$$s = \exp(-(r-1/2)^2)$$

and $w$ is the parameter I called the "wiggle". This path is $4\pi$ periodic, and it owes its existence to the simply connectedness of the double cover $SU(2) \to SO(3)$.

This path is drawn in the top left insert, where I draw $SO(3)$ as a 3-ball with anti-podal boundary points identified.
