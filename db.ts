import { fauna } from "./deps.ts";
import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";

const DB_SECRET = Deno.env.get("DB_SECRET") ?? config()?.DB_SECRET;

const {
    Create,
    Collection,
    Replace,
    Get,
    Select,
    Match,
    Map,
    Paginate,
    Delete
} = fauna.query;

export type Document<T> = fauna.values.Document<T>;

const client = new fauna.Client({
    secret: DB_SECRET ?? new Error("DB_SECRET not found"),
    domain: "db.eu.fauna.com"
});

export async function insert<T>(into: string, obj: T) {
    const fql = Create(Collection(into), { data: obj });
    const res = await client.query(fql) as Document<T>;
    return res?.data;
}

export async function update<T>(withIndex: string, id: string, obj: T) {
    const fql = Replace(
        Select("ref",
            Get(
                Match(withIndex, id)
            )
        ), { data: obj });

    const res = await client.query(fql) as Document<T>;
    return res?.data;
}

export async function get<T>(withIndex: string, id: string) {
    const fql = Get(
        Match(
            withIndex,
            id
        )
    );
    const res = await client.query(fql) as Document<T>;
    return res?.data;
}

export async function getAll<T>(withIndex: string) {
    const fql = Map(
        Paginate(
            Match(withIndex)
        ),
        o => Select("data", Get(o))
    );
    const res = await client.query(fql) as Document<T[]>;
    return res?.data;
}

export async function remove<T>(withIndex: string, id: string) {
    const fql = Delete(
        Select(
            "ref",
            Get(
                Match(
                    withIndex,
                    id
                )
            )
        )
    );
    const res = await client.query(fql) as Document<T>;
    return res?.data;
}
