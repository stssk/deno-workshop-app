# Oppgaver for å bli kjent med deno

En Miles workshop

## Resurser

Det er tre resurser som vil være nyttig i denne delen av workshopen.

- [Deno API](https://doc.deno.land/deno/stable) Funksjoner som følger med deno runtime
- [Deno standard library](https://deno.land/std) Ekstrafunksjoner lager av deno-utviklerene som er garantert å virke godt med Deno
- [MDN](https://developer.mozilla.org/en-US/) Den beste ressursern for å finne ut av JavaScript/TypeScript

## 1. Hei Miles 👋

1. Lag en app, hei.ts som skriver ut "Hei Miles 👋" til skjermen.
2. Lag om hei.ts slik at du kan legge til en parameter som vil bytte ut Miles
    - Du finner dokumentasjon for Deno standard library [her](https://doc.deno.land/deno/stable)

```sh
❯ deno run hei.ts Pär

Hei Pär 👋
```

3. Modifiser slik at du sier hei til flere, en per linje.

```sh
❯ deno run hei.ts Pär Stian

Hei Pär 👋
Hei Stian 👋
```

## 2. Jobbe med filer 📂

Deno har for det meste holdt seg til web- standarder. `window.` er omtrent full-implemetert. Vi har i tillegg noen funksjoner i deno. Du finner alle disse [her](https://doc.deno.land/deno/stable).

1. Lag et program som skriver en fil til mappen med dagens dato
    - Bruk `Deno.writeFile`

```sh
❯ deno run --allow-write skrivFil.ts
```

2. Lag et program som henter ut informasjon om program-filen selv og skriver dette til terminalen
    - Bruk `Deno.lstat`

```sh
❯ deno run --allow-read filinfo.ts

{
  isFile: true,
  isDirectory: false,
  isSymlink: false,
  size: 62,
  mtime: 2022-02-20T15:37:27.043Z,
  atime: 2022-02-20T15:37:28.103Z,
  birthtime: 2022-02-20T15:30:15.856Z,
  dev: 16777220,
  ino: 53179137,
  mode: 33188,
  nlink: 1,
  uid: 501,
  gid: 20,
  rdev: 0,
  blksize: 4096,
  blocks: 8
}
```

3. Lag et program som lister ut alle filer i mappen i synkende rekkefølge etter når de sist ble modifisert

4. (Bonus) Bruk `colors.ts` standard-bibloteket til å formatere output i farger.

## 3. Nettverk

En av fordelene med deno er, igjen, at du har `window.`. Her finner vi også `window.fetch`.

```ts
const res = await fetch("https://miles.no");
if(res.ok) {
    const data = await res.text();
    console.log(data);
}
```

1. Hent ned en post fra [dummyjson.com](https://dummyjson.com)
    - Husk å bruke `await res.json()` i stedet for `.text()`

2. POST en post til det samme stedet. Bruk gjerne dokumentasjonen på nettstedet.

3. PUT

...

## 4. Eksterne biblotek

Deno har et enormt biblotek av eksterne moduler. Du finner mange av dem på [deno.land/x](https://deno.land/x)

1. Lag en app som kan decode en JWT på samme måte som jwt.ms

```sh
❯ deno run jwt.ts ey...

Header:
{ alg: "HS256" }

Payload:
{
  sub: "stian",
  email: "stian.skauge@miles.no"
...
```

2. Lag en app som kan sjekke om et telefonnummer er gyldig


```sh
❯ deno run phonenumber.ts +4795115159

Phone number is valid ✅
```

3. (Bonus) Installer appene om du vil `deno install --help`

## 5. Testing

Deno har et innebygget verktøy for testing `deno test`. Det har også en satandard-modul med asserts [testing/asserts](https://deno.land/std@0.126.0/testing/asserts.ts). Funksjonen `assertEquals` er spesielt nyttig da den gjør en deep compare.

Les mer om testing [her](https://deno.land/manual@v1.19.0/testing)

1. Lag en test som sjekker at POST fra oppgave 3 returnerer det samme objektet som du sendte