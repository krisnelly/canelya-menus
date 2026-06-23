// ── COMPOSANT — ONGLET CRÉATION MANUELLE DE MENUS ────────────────────────────
// Permet de composer un menu à la main : on choisit dans la base (et/ou en
// saisie libre) chaque plat, et on peut ajouter des items ponctuels avec leur
// fournisseur/prix/portion pour que la fiche d'achat reste conforme.
//
// Produit le MÊME objet `entry` que la génération auto (via assembleEvenement)
// → Résultat, fiche d'achat, documents Word et bouton Enregistrer fonctionnent
// à l'identique. Ne touche à aucune règle ni au moteur de génération.

import { useState } from "react";
import EtapeClient, { canNextEtapeClient } from "./EtapeClient";
import EtapePrestations, { canNextEtapePrestations } from "./EtapePrestations";
import EtapeLogistique from "./EtapeLogistique";
import EtapeEquipe from "./EtapeEquipe";
import { assembleEvenement } from "../logic/genererEvenement";
import { optionsFor } from "../logic/cataloguesManuel";
import { CATEGORIES_CUSTOM, FOURNISSEURS_CUSTOM } from "../data/categoriesCustom";
import { JOURS } from "../data/clients";

const FORM0 = {
  clientId: "", clientAutre: "", nomEvenement: "", dateDebut: "", nombrePersonnes: 20,
  produitsAEcouler: "", ruptureStock: "",
  jours: [],
  pMatin: true, hMatin: "09:00",
  pDej: true, hDej: "12:00",
  pApm: false, hApm: "15:00",
  pCocktailDej: false, hCocktailDej: "12:30",
  pCocktailDin: false, hCocktailDin: "18:00",
  alcool: false,
  typeEvenement: "Interne", distanceKm: 0, cuissonSurPlace: false, sensible: false,
  superviseurTerrain: "Muriel", superviseurCuisine: "Kris-Nelly", dresscode: "Wida 1",
};

const norm = s => String(s || "").toLowerCase().replace(/\(.*?\)/g, "").replace(/\s+/g, " ").trim();

const ADHOC_CATS = [...CATEGORIES_CUSTOM, { key: "ACCOMPAGNEMENTS", label: "Accompagnement (déjeuner)", four: "MARCHE" }];
const CHAUDS_OPTS = ["The + Lait + Cafe", "The", "Cafe", "Lait", "Chocolat chaud"];

// ── Sélecteur multi (chips) : choix dans la base + saisie libre ───────────────
function PickList({ options, value, onChange }) {
  const [free, setFree] = useState("");
  const add = v => { const t = (v || "").trim(); if (t && !value.includes(t)) onChange([...value, t]); };
  return (
    <div>
      <div className="jg" style={{ marginBottom: 6 }}>
        {value.length === 0 && <span className="hid">Aucun choix</span>}
        {value.map(v => (
          <span key={v} className="jb on" style={{ cursor: "default" }}>
            {v}
            <span style={{ cursor: "pointer", marginLeft: 6, fontWeight: 700 }} onClick={() => onChange(value.filter(x => x !== v))}>✕</span>
          </span>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <select value="" onChange={e => add(e.target.value)} style={{ flex: "1 1 160px" }}>
          <option value="">+ depuis la base…</option>
          {options.filter(o => !value.includes(o)).map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <input
          type="text" value={free} onChange={e => setFree(e.target.value)}
          placeholder="ou saisie libre"
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); add(free); setFree(""); } }}
          style={{ flex: "1 1 140px" }}
        />
        <button className="btn-s" onClick={() => { add(free); setFree(""); }}>+ Libre</button>
      </div>
    </div>
  );
}

export default function CreationManuelle({ items, onCreer }) {
  const [form, setForm] = useState(FORM0);
  const [phase, setPhase] = useState("params"); // params | compose
  const [picks, setPicks] = useState({});
  const [adHoc, setAdHoc] = useState([]);
  const [ah, setAh] = useState({ category: "MATIN_SALES", nom: "", fournisseur: "PATISSERIE", prix: "", portion: "" });

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const togJ = j => upd("jours", form.jours.includes(j) ? form.jours.filter(x => x !== j) : [...form.jours, j]);

  const get = (jour, prest, slot) => ((picks[jour] || {})[prest] || {})[slot] || [];
  const setPick = (jour, prest, slot, arr) => setPicks(p => ({
    ...p,
    [jour]: { ...(p[jour] || {}), [prest]: { ...((p[jour] || {})[prest] || {}), [slot]: arr } },
  }));

  // options(catKeys...) = base + custom + ad-hoc, fusionnées et dédoublonnées
  const options = (...keys) => [...new Set(keys.flatMap(k => optionsFor(k, items, adHoc)))];

  const paramsOK = canNextEtapeClient(form) && canNextEtapePrestations(form);

  // ── Ajout d'un item ponctuel (ad-hoc) ──────────────────────────────────────
  const ajouterAdHoc = () => {
    if (!ah.nom.trim()) { alert("Le nom de l'item ponctuel est obligatoire."); return; }
    setAdHoc([...adHoc, {
      id: Date.now(), category: ah.category, nom: ah.nom.trim(),
      fournisseur: ah.fournisseur, prix: ah.prix === "" ? null : Number(ah.prix), portion: ah.portion.trim(),
    }]);
    setAh({ ...ah, nom: "", prix: "", portion: "" });
  };

  // ── Construction de l'événement final ──────────────────────────────────────
  const creer = () => {
    const join = (jour, prest, slot, sep = ", ") => get(jour, prest, slot).join(sep);
    const menus = {};
    form.jours.filter(j => JOURS.includes(j)).forEach(jour => {
      const m = {};
      if (form.pMatin) m.matin = {
        sucres: join(jour, "matin", "sucres"), sales: join(jour, "matin", "sales"),
        fruits: join(jour, "matin", "fruits"), chauds: join(jour, "matin", "chauds") || "The + Lait + Cafe",
        bouillie: join(jour, "matin", "bouillie"), boisson: join(jour, "matin", "boisson"), isLundi: jour === "Lundi",
      };
      if (form.pDej) m.dejeuner = {
        entree: join(jour, "dejeuner", "entree"), proteines: join(jour, "dejeuner", "proteines", " / "),
        accomp: join(jour, "dejeuner", "accomp"), dessert: join(jour, "dejeuner", "dessert"),
        boisson: join(jour, "dejeuner", "boisson"), isLundi: jour === "Lundi",
      };
      if (form.pApm) m.apm = {
        sucres: join(jour, "apm", "sucres"), sales: join(jour, "apm", "sales"), boisson: join(jour, "apm", "boisson"),
      };
      if (form.pCocktailDej) m.cocktailDej = {
        sales: join(jour, "cocktailDej", "sales"), sucres: join(jour, "cocktailDej", "sucres"), boissons: join(jour, "cocktailDej", "boissons"),
      };
      if (form.pCocktailDin) m.cocktailDin = {
        sales: join(jour, "cocktailDin", "sales"), sucres: join(jour, "cocktailDin", "sucres"), boissons: join(jour, "cocktailDin", "boissons"),
      };
      menus[jour] = m;
    });

    // Catalogue pour la fiche d'achat = items custom (config) + items ponctuels
    const customCatalogue = {};
    [...(items || []), ...adHoc].forEach(it => {
      if (it && it.nom) customCatalogue[norm(it.nom)] = [it.fournisseur || "MARCHE", it.prix ?? null, it.portion || ""];
    });

    onCreer(assembleEvenement(form, menus, customCatalogue));
  };

  // ── Rendu d'un créneau (catégorie) ─────────────────────────────────────────
  const Slot = ({ jour, prest, name, label, keys, fixedOpts }) => (
    <div style={{ marginBottom: 12 }}>
      <label>{label}</label>
      <PickList options={fixedOpts || options(...keys)} value={get(jour, prest, name)} onChange={v => setPick(jour, prest, name, v)} />
    </div>
  );

  // ── PHASE 1 : paramètres (réutilise les étapes existantes) ─────────────────
  if (phase === "params") {
    return (
      <div>
        <div className="inf">
          ✍️ Création manuelle — vous composez chaque plat vous-même. Renseignez d'abord le client, les prestations,
          la logistique et l'équipe, puis passez à la composition.
        </div>
        <EtapeClient form={form} upd={upd} />
        <EtapePrestations form={form} upd={upd} togJ={togJ} />
        <EtapeLogistique form={form} upd={upd} />
        <EtapeEquipe form={form} upd={upd} />
        <div className="row-btns">
          <button className="btn-g" style={{ width: "auto", padding: "11px 28px" }} disabled={!paramsOK} onClick={() => setPhase("compose")}>
            Composer le menu →
          </button>
        </div>
        {!paramsOK && <div className="warn" style={{ marginTop: 10 }}>Sélectionnez au moins le client, un jour et une prestation pour continuer.</div>}
      </div>
    );
  }

  // ── PHASE 2 : composition manuelle ─────────────────────────────────────────
  return (
    <div>
      {/* Items ponctuels */}
      <div className="card">
        <div className="ct">🧩 Items ponctuels (optionnel)</div>
        <div className="inf">
          Ajoutez ici un plat absent de la base, avec son fournisseur et son prix : il deviendra sélectionnable ci-dessous
          et sera chiffré dans la fiche d'achat. (Ponctuel = pour ce menu seulement. Pour un ajout permanent, utilisez l'onglet Configuration.)
        </div>
        <div className="g2">
          <div>
            <label>Catégorie</label>
            <select value={ah.category} onChange={e => {
              const c = ADHOC_CATS.find(x => x.key === e.target.value);
              setAh({ ...ah, category: e.target.value, fournisseur: c ? c.four : ah.fournisseur });
            }}>
              {ADHOC_CATS.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label>Nom de l'item</label>
            <input type="text" value={ah.nom} onChange={e => setAh({ ...ah, nom: e.target.value })} placeholder="Ex. Verrine mangue-coco" />
          </div>
        </div>
        <div className="g3" style={{ marginTop: 14 }}>
          <div>
            <label>Fournisseur</label>
            <select value={ah.fournisseur} onChange={e => setAh({ ...ah, fournisseur: e.target.value })}>
              {FOURNISSEURS_CUSTOM.map(x => <option key={x.key} value={x.key}>{x.label}</option>)}
            </select>
          </div>
          <div>
            <label>Prix / pers (FCFA)</label>
            <input type="number" value={ah.prix} onChange={e => setAh({ ...ah, prix: e.target.value })} placeholder="vide = Variable" />
          </div>
          <div>
            <label>Portion / note</label>
            <input type="text" value={ah.portion} onChange={e => setAh({ ...ah, portion: e.target.value })} placeholder="Ex. 1/pers" />
          </div>
        </div>
        <div className="row-btns">
          <button className="btn-s" onClick={ajouterAdHoc}>➕ Ajouter cet item ponctuel</button>
        </div>
        {adHoc.length > 0 && adHoc.map(it => (
          <div key={it.id} className="hi">
            <div>
              <span className="hic">{it.nom}</span>
              <div className="hid">{it.fournisseur}{it.prix != null ? ` · ${it.prix} FCFA/pers` : " · Variable"}{it.portion ? ` · ${it.portion}` : ""}</div>
            </div>
            <button className="btn-del" onClick={() => setAdHoc(adHoc.filter(x => x.id !== it.id))}>Suppr.</button>
          </div>
        ))}
      </div>

      {/* Composition jour par jour */}
      {form.jours.filter(j => JOURS.includes(j)).map(jour => (
        <div className="card" key={jour}>
          <div className="ct">📅 {jour}</div>

          {form.pMatin && (
            <div style={{ marginBottom: 16 }}>
              <div className="rs" style={{ marginBottom: 8 }}>Pause café matin</div>
              <Slot jour={jour} prest="matin" name="sucres" label="Sucrés" keys={["MATIN_SUCRES_BLE", "MATIN_SUCRES_ALT"]} />
              <Slot jour={jour} prest="matin" name="sales" label="Salés" keys={["MATIN_SALES"]} />
              <Slot jour={jour} prest="matin" name="fruits" label="Fruits" keys={["MATIN_FRUITS"]} />
              <Slot jour={jour} prest="matin" name="chauds" label="Boissons chaudes" fixedOpts={CHAUDS_OPTS} />
              <Slot jour={jour} prest="matin" name="bouillie" label="Bouillie" keys={["MATIN_BOUILLIES"]} />
              <Slot jour={jour} prest="matin" name="boisson" label="Boisson froide" keys={["MATIN_BOISSONS"]} />
            </div>
          )}

          {form.pDej && (
            <div style={{ marginBottom: 16 }}>
              <div className="rs" style={{ marginBottom: 8 }}>Déjeuner</div>
              <Slot jour={jour} prest="dejeuner" name="entree" label="Entrée" keys={["ENTREES"]} />
              <Slot jour={jour} prest="dejeuner" name="proteines" label="Protéine(s)" keys={["PROTEINES"]} />
              <Slot jour={jour} prest="dejeuner" name="accomp" label="Accompagnement(s)" keys={["ACCOMPAGNEMENTS"]} />
              <Slot jour={jour} prest="dejeuner" name="dessert" label="Dessert" keys={["DESSERTS"]} />
              <Slot jour={jour} prest="dejeuner" name="boisson" label="Boisson" keys={["DEJ_BOISSONS"]} />
            </div>
          )}

          {form.pApm && (
            <div style={{ marginBottom: 16 }}>
              <div className="rs" style={{ marginBottom: 8 }}>Pause café APM</div>
              <Slot jour={jour} prest="apm" name="sucres" label="Sucrés" keys={["APM_SUCRES_BLE", "APM_SUCRES_ALT"]} />
              <Slot jour={jour} prest="apm" name="sales" label="Salés" keys={["APM_SALES"]} />
              <Slot jour={jour} prest="apm" name="boisson" label="Boisson" keys={["APM_BOISSONS"]} />
            </div>
          )}

          {form.pCocktailDej && (
            <div style={{ marginBottom: 16 }}>
              <div className="rs" style={{ marginBottom: 8 }}>Cocktail déjeunatoire</div>
              <Slot jour={jour} prest="cocktailDej" name="sales" label="Salés" keys={["COCKTAIL_SALES"]} />
              <Slot jour={jour} prest="cocktailDej" name="sucres" label="Sucrés" keys={["COCKTAIL_SUCRES"]} />
              <Slot jour={jour} prest="cocktailDej" name="boissons" label="Boissons" keys={["COCKTAIL_BOISSONS_SOFT"]} />
            </div>
          )}

          {form.pCocktailDin && (
            <div>
              <div className="rs" style={{ marginBottom: 8 }}>Cocktail dînatoire</div>
              <Slot jour={jour} prest="cocktailDin" name="sales" label="Salés" keys={["COCKTAIL_SALES"]} />
              <Slot jour={jour} prest="cocktailDin" name="sucres" label="Sucrés" keys={["COCKTAIL_SUCRES"]} />
              <Slot jour={jour} prest="cocktailDin" name="boissons" label="Boissons" keys={["COCKTAIL_BOISSONS_SOFT", "COCKTAIL_BOISSONS_ALC"]} />
            </div>
          )}
        </div>
      ))}

      <div className="row-btns">
        <button className="btn-n" onClick={() => setPhase("params")}>← Paramètres</button>
        <button className="btn-g" style={{ width: "auto", padding: "11px 28px" }} onClick={creer}>✅ Créer le menu</button>
      </div>
    </div>
  );
}
