# Miles fagdag Hands on with deno

## 🤷‍♀️ Hva skal vi bygge?

- I denne oppgaven skal vi bygge et lite API som lar brukere legge inn anmeldelser på events
- Vi bruker oak, som er det mest brukte rammeverket for deno
- I eksempelet har jeg brukt FaunaDB, men det er mulig å bytte disse ut med MongoDB eller andre databaser. Se på deno.land/x for å se om det finnes en god driver for din favoritt
- Oppgaven er laget med en litt klassisk backend layout
- Vi skal til slutt legge appen ut på deno deploy ❤️

## 🐿 Kort om oak

Oak er et web rammeverk som ligner veldig mye på koajs. Det deler samme oppbygning, og kan i
mange tilfeller bruke samme middleware. Oak er bygget på toppen av deno sitt innebygde http-biblotek som igjen bruker
[Hyper](https://github.com/hyperium/hyper), en ny http- implementasjon skrevet i Rust.

En oak app er bygget opp med middleware

```ts
import { Application } from "https://deno.land/x/oak/mod.ts";

const app = new Application();

app.use((ctx) => {
  ctx.response.body = "Hello World!";
});

await app.listen({ port: 8000 });
```

`app.use()` Tar en funksjon med to parametre:

- `ctx: Context` inneholder data om request, response og parametre
- `next: () => {}` er en funksjon for å kalle neste middleware

Her kan du for eksempel logge requests som kommer inn ved å kjøre

```ts
app.use(async (ctx, next) => {
    console.log(ctx.request.url);
    await next();
});
```

## 🛠 Nok om det. La oss starte på appen

### 🌳 Oak basics

1. Lag et nytt github repo og klon det til en mappe
2. Lag en fil `deps.ts` som skal inneholde alle dependencies

```ts
export { Application } from "https://deno.land/x/oak@v10.2.0/mod.ts";
```

3. Lag en fil `app.ts` som oppstartsfilen for appen
4. Importer Application fra deps og sett opp _Hello World!_ som vist over

```sh
❯ deno run --allow-net=0.0.0.0:8000 app.ts
```

5. Legg til en middleware som sjekker om brukeren har skrevet en query parameter. Legg inn teksten i query parameter som svar.
6. Legg til en middleware som svarer på `/my-browser` og svarer med det som ligger i User-Agent headeren

### 🌳 oak Router

Oak har en innebygget router som forenkler jobben med å sjekke url, method og parametre. La oss bruke den i stedet...

1. Gå inn i `deps.ts` og legg til `Router` i importen til oak.
2. Importer `Router` i `app.ts`
3. Lag en ny router over der du laget en `Application`:

```ts
const router = new Router();
router.get('/routed', (ctx) => {});
```

4. Registrer router nederst i application

```ts
app.use(router.routes());
app.use(router.allowedMethods());
```

5. Legg inn et response når brukere går mot `/routed`

### 🖥 Database

Deno har støtte for mange populære databaser gjennom eksterne biblotek. Her kan du velge din egen favoritt, men denne guiden bruker FaunaDB.

FaunaDB?

- Det er en relasjonell dokument-database med støtte for graphQL
- De har laget et godt biblotek som støtter ESModules
- De har gratis 100k spørringer i måneden

#### Oppsett av fauna

1. Gå til [fauna.com](https://fauna.com) og sign up
2. I dashboardet lager du en ny dataabase i region Europe
3. Trykk på collections og lag en ny collection `feedback`
    - History days kan fint være 30. Dette er hvor lenge fauna skal ta vare på endringer i data.
    - TTL bør være blank. Dette er hvor lenge fauna skal ta vare på data før det slettes fra databasen. Kjempefint for logger eller cache, men ikke for data.
4. Trykk på indexes. Her skal vi lage 2 indekser på feedback
    1. `feedback_id` med terms `data.id` og `✅ unique`
    2. `feedback_all` uten terms eller unique
5. Gå inn i Security og lag en ny nøkkel `lokal` med rolle Service. Kopier nøkkelen

#### Koden

1. Lag en fil i repoet `.env` Legg denne til i .gitignore
2. Legg inn nøkkelen fra fauna dashboard

```dotenv
DB_SECRET=ey...
```

3. Legg inn fauna i `deps.ts`

```ts
export * as fauna from "https://deno.land/x/fauna@5.0.0-deno-alpha9/mod.ts";
```

4. Lag en ny fil `db.ts` og kopier inn koden fra dette repoet

### 💃 Model

1. Lag en ny fil `model.ts` som inneholder modellen. Denne må ha minst `id: string` og noen andre felt. Eksempel:

```ts
export interface Feedback {
    id: string;
    subject: string;
    feedback: string | undefined;
    stars: 1 | 2 | 3 | 4 | 5 | undefined;
}
```

### 🧱 Repository

Lag en ny fil `repo.ts` med funksjonene under og hent data med hjelp fra `db.ts`

```ts
async function addFeedback(feedback: IFeedback): Promise<IFeedback> {}

async function removeFeedback(id: string): Promise<IFeedback>  {}

async function getAllFeedback(): Promise<IFeedback[]>  {}

async function getFeedback(id: string): Promise<IFeedback>  {}

async function updateFeedback(id: string, obj: IFeedback): Promise<IFeedback> {}
```

### 👷‍♀️ Controller

1. Vi lager en ny fil `controller.ts`
2. Denne skal ha 5 funksjoner for å hente (en eller alle), oppdatere, slette eller redigere

```ts
async function getFeedback(ctx: RouterContext<"/feedback/:id", { id: string; }>) {}

async function getAllFeedback(ctx: RouterContext<"/feedback", State>) {}

async function addFeedback(ctx: RouterContext<"/feedback", State>) {}

async function updateFeedback(ctx: RouterContext<"/feedback/:id", { id: string; }>) {}

async function deleteFeedback(ctx: RouterContext<"/feedback/:id", { id: string; }>) {}

export default { getFeedback, getAllFeedback, addFeedback, updateFeedback, deleteFeedback };

```

3. Legg inn disse funksjonene i routeren i `app.ts`

```ts
router.get("/feedback/:id", controller.getFeedback);
router.get("/feedback", controller.getAllFeedback);
router.post("/feedback", controller.addFeedback);
router.put("/feedback/:id", controller.updateFeedback);
router.delete("/feedback/:id", controller.deleteFeedback);
```

4. Gå tilbake i `controller.ts` og implementer funksjonene

### 🦕 Deno deploy

Deno deploy er en serverless hosting provider som enda er i Beta. Den er for tiden helt gratis, men har noen begrensninger på antall kall/ cpu-tid osv.

1. Gå inn på [deno deploy](https://deno.com/deploy) og sign up
2. I dashboardet trykker du `New project`
3. Lag et passende navn `Miles fagdag rocks`?
4. Du har nå to valg. Velg en og se at deno deploy henter og deployer appen din
    1. Legge inn en deploy url (public) direkte til app.ts
    2. Knytte opp mot github
        - jeg bruker denne siste her for å kunne deploye private repo
5. Gå inn i `Settings` ➡ `Environment variables`
    - Legg til key: DB_SECRET
    - Hent en ny nøkkel fra fauna og legg inn her
6. Done
7. Seriøst... Appen din kjører på {navn}.deno.dev

### 🍻 Jeg håper vi har litt tid igjen

Her er noen forslag til features du kan legge inn. Husk å bruke [modul-bibloteket](https://deno.land/x) for å gjøre jobben lettere.

- autentisering
- feilhåndtering
- validering
- logging
- slack-integrasjon
- 💭