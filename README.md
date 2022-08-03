# Tally Lights Online

[![Website](https://img.shields.io/website?down_color=%23EC7C26&down_message=offline&label=website&up_message=online&url=http%3A%2F%2Ftally-lights.bouhartsev.top%2F)](https://tally-lights.bouhartsev.top/ "Go to Tally Lights")
[![Website](https://img.shields.io/badge/made%20by-bouhartsev-%23E8252F)](https://bouhartsev.top/ "Go to bouhartsev.top")

Tally Lights is an online service for interaction between the broadcast director and cameramen. With Tally Lights Online, you can inform a camera operator that his camera is on air, without any additional equipment.

[CREATE PROJECT](https://tally-lights.bouhartsev.top/new "Create Tallу Lights project")

## How does it work?

The director goes on air. Cameramen connect using their links from any device (phone, tablet). The director can click on the number of the camera that he put on the air - this change will be displayed to others on the set.

At any time, the director can go to the settings page and change the preferences.

<details><summary>read more</summary>

<br />

### Director page

Green means that the camera is in preview mode, red means the camera is on the air. The camera can be put on the air only after the preview. But double-clicking on the button immediately turns the camera into "on air" mode.

If the camera is not connected, the button with its number has an orange border.

The director can remove selection from all cameras by clicking on the "No camera" button.

### Operator page

All possible modes and statuses displayed on the operator's page:
- preview (green background)
- on air (red background)
- offline (orange foreground):
- camera doesn't exist
- camera is disconnected

### Settings page

Available preferences:
- Project title (it will be used in URL and etc.): 3-18 length, only latin characters, digits and dashes
- Cameras quantity (amount of cameras on the set): 1-255 number

Future preferences (not implemented yet):
- Sound (default sound signals for cameramen): true or false

Under preferences you can find links to director's and operators' pages. It will ONLY work if you are live. You can copy links to send it. Send links with caution: in the current version we are NOT support any kind of password.

Live mode allows to connect (or disconnect) all participants. It is made for the purposes of security and optimization of the application. To change status switch "broadcast" button at the bottom of settings page. Еhe live mode will turn off automatically at the time specified under the button in case of inactivity.

### Video tutorial

Coming soon
<!-- iframe -->

</details>

<br />

## About Tally Lights technology

Tally lights are important tools for simplifying production in a video studio setting. It can be used both for broadcasts and for filming shows. These lights show which camera is currently live, benefiting both camera operators and on-screen persons.

## Advantages of the solution

The Tally is
- *L*icense-free (service is free [to use][1])
- *I*nternational (available worldwide)
- *G*ood-looking (simple, clear and pleasant design)
- *H*andy (customizable and efficient)
- *T*rustworthy (safe and reliable system)
- *S*wift (with the fast Internet connection)

<!-- for low-budget projects especially -->

## Open source

Code [on GitHub](https://github.com/bouhartsev/tally-lights/)

Future features in [TODO](https://github.com/bouhartsev/tally-lights/projects/1)

License [Apache License 2.0][1]

For **contribution** please contact me [in any way](https://bouhartsev.top/#contacts "Go to contacts").

## Used technologies

- [Node.JS](https://github.com/nodejs/node "To source")
- [Express](https://github.com/expressjs/express "To source")
- [PUG](https://github.com/pugjs/pug "To source")
- [Socket.IO](https://github.com/socketio/socket.io "To source")
- [Transliteration](https://github.com/dzcpy/transliteration "To source")

All technologies are available under the [MIT License](https://opensource.org/licenses/MIT)

[1]: https://github.com/bouhartsev/tally-lights/blob/main/LICENSE.md (Go to the License)