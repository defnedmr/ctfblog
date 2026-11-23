---
title: WolvCTF 2026
date: 2026-11-23
tags: web, crypto, osint, forensics
description: I'm excited to share my first writeup, in second CTF I've participated in. I think question quality was great, there's plenty of questions from each difficulty/topic. I wish success to authors, and I will be voting positively on CTFTime.
---

## spoofify [web]

The plan information is sent in a plaintext cookie, "sid=free". Changing it to "sid=premium" and sending a GET request to the URL is enough.

![pasted-image-20261122230900.png](img/wolvctf2026/pasted-image-20261122230900.png)

## You Shall Pass [web]

We are given the server.js file and the description "An authentication service asks you to log in with a user and token". From the control logic in server.js we can see that the only accepted user is "admin". We only need an acceptable token, but there is no way to guess or brute-force it. Instead, we notice a flaw in the token check: if we send an empty array as the "token" field, the server never rejects it, because there is no check for an empty array.

![pasted-image-20261122231230.png](img/wolvctf2026/pasted-image-20261122231230.png)

![pasted-image-20261121133357.png](img/wolvctf2026/pasted-image-20261121133357.png)

## StickyNotes [web]

Site works as a note taker and it only takes a username to view the notes. We test with a username and add a note to see how system works. Notes are opened in the path ../notes/{note-id}. Correct answer lies in /notes/1. (I tried /admin and site said "Nice Try"..)

![stickynotes.png](img/wolvctf2026/stickynotes.png)

## On the Rail Fence [crypto]
Given the string "H!hcsiH!hnrheiatcaedaeatetvaateqiesliohnemntealtteitrvlataltteoq'igeosalHi!oihgnhlaesnbsHi!ohvcosainHi!ohcnurnhreHi!altMcia,hcaposfhWs!iovoaniocunrH!lMiterdtltirltlto'goaH!igthioet", it is apparently a 3-rail rail fence cipher, and the song name The Victors is the answer (wctf{the-victors}).

## maize poster [crypto]
Our hint says "If you squint really closely at the pixels you might find it.", pointing at some pixel differences. Exactly 103 pixels are a very slightly different blue from the rest of the poster (normal navy (0,39,76), different navy (0,39,77)). If we read the pixels in row-major order, putting 0 for blue 76 and 1 for blue 77, we can read the result as ASCII. Decoding that with ROT13 gives wctf{r0t13_1n_th3_blu3}.

![poster.png](img/wolvctf2026/poster.png)

## Layers [crypto]
"NjIgNjEgNzYgNjIgNjEgNjYgMmQgNzUgNmUgNjkgNzIgMmQgNzkgNmUgNmMgNzIgNjUgNjY=" is given. The outer layer is Base64; decoding it gives "62 61 76 62 61 66 2d 75 6e 69 72 2d 79 6e 6c 72 65 66". Interpreting those hex bytes as ASCII produces "bavbaf-unir-ynlref". The last layer is ROT13, which gives "onions-have-layers", fittingly.

## This Is Wolv-01 [osint]

![pasted-image-20261122235305.png](img/wolvctf2026/pasted-image-20261122235305.png)

The challenge describes a Martello tower, one of the British Empire's coastal defensive forts, that displays vintage radio equipment. The photo shows old radio gear: a Sailor receiver, a "Transistor Reporter" and a Sealine II marine radio. The match is Ye Olde Hurdy Gurdy Museum of Vintage Radio, which sits in the Martello tower in Howth, Dublin. The museum is the brainchild of Pat Herbert, who moved his collection of vintage radios, record players, and televisions into the tower in 2003. The museum's own site calls him the founder and curator of The Hurdy Gurdy Museum of Vintage Radio, which matches the "founded and curated" wording in the question.

## Pants on fire [osint]
The hint is: "I found this screenshot from sometime in the past year when clearing out my screenshots folder, any chance you can tell me the name of the body of water", about a forest fire near a lake that happened in 2025. wctf{great-bear-lake}

## A very meta ctf [forensics]
We are given 10 PNGs named 1 to 10. Each one is a photo of a number, but funnily enough none of them shows the same number as its name. At the end of every PNG's metadata section there were hexadecimal characters that could be converted to ASCII.

| Image | ASCII |
| :--- | :--- |
| one | s_ |
| two | g_IE0j32e} |
| three | l4 |
| four | {t |
| five | tf |
| six | _4 |
| seven | 1s |
| eight | wc |
| nine | h1 |
| ten | _f |

The first three parts (eight, five, four) and the last part (two) were obvious, but the rest still needed to be worked out. I wrote a Python script to check every permutation of the remaining pieces. The only meaningful combination is the answer: wctf{th1s_1s_4_fl4g_IE0j32e}
