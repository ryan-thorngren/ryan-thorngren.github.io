[Go to the animation](https://ryan-thorngren.github.io/spinors/)

This is my take on [this lovely spinor animation on wikipedia](https://en.wikipedia.org/wiki/File:Belt_Trick.ogv). I have a love/hate relationship with fermions and I'm always looking to understand them more deeply. I knew about the single belt trick, but seeing all those belts and none of them getting tangled really blew me away. Immediately I wondered, how do you make this?

Well here's how I went about it. I thought one way to ensure no tangling is to apply rotations to spheres of different radii. So essentially I need to choose a time dependent path

$$M(r,t) \in SO(3)$$

with the boundary conditions $M(1,t) = 1$, and $M(0,t) = R(t)$ a rotation around a fixed axis with angle proportional to $t$. At time $t$ we apply $M(r,t)$ to the sphere of radius $r$. So long as $M(r,t)$ is smooth we'll have a smooth animation.

I plotted the path I chose in the top left insert if you click "toggleLegend", where I drew $SO(3)$ as a 3-ball with anti-podal boundary points identified (fun puzzle: figure out the group multiplication in this embedding!).

To find a smooth path first I chose a function $s(r)$ which for $r \in \[0,r_0\)$ (for some inner radius $r_0$) is constant $s(r) = 1$ and then decays to zero as $r \to \infty$.

Then I take $M(r,t) = N(s(r),t)$, where $N(s,t) = N_0(s,t) + \delta N(s,t)$. $N_0(s,t)$ is a linear interpolation (see below) between the identity at $s = 0$ and an $X$ rotation by angle $t$ at $s = 1$. In terms of Pauli matrices we can write this rotation as

$$e^{i t X} = \cos(t/2) + i \sin(t/2) X.$$

We can linearly interpolate simply by taking

$$N_0(s,t) = s e^{i t X} + (1-s).$$

However, at $s = 1/2$ we get a singularity,

$$N_0(1/2,t) = \frac{1}{2}(\cos(t/2) - 1 + i \sin(t/2))$$

vanishes at $t = 2\pi n$ and we can't normalize the whole path to get a family of $SU(2)$ rotations. To fix this, we add some "wiggle", a matrix function $\delta N(s,t)$ which vanishes at $s = 0$ and $s = 1$ for all $t$ and doesn't vanish at $s = 1/2$ and $t = 2\pi n$. Any such function will do, so long as we use a different axis from X! I chose

$$\delta N(s,t) = w s(1-s) Z,$$

where $w$ is the parameter called wiggle in the simulation. This essentially applies a $Z$ rotation to intermediate radii around $s = 1/2$. Like magic, this allows us to completely avoid the singularity!

Note that since we used $SU(2)$ / quaternions, we paid the price of having a $4\pi$ periodic rather than $2\pi$ periodic animation. There's no way around this, since $\pi_1 SO(3)$ is nontrivial, but the fact that we can do this at all proves $\pi_1 SO(3)$ is 2-torsion.
