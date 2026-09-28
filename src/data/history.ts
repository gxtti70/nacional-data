export type HistoryEvent = { year: string; title: string; text: string; gold?: boolean }

export const events: HistoryEvent[] = [
  { year: '1947', title: 'Fundación', text: 'Nace el club en Medellín. Comienza la historia verdolaga.' },
  { year: '1954', title: 'Primer título de liga', text: 'Primera estrella en las vitrinas del club.' },
  { year: '1973', title: 'El despertar de la sequía', text: 'Segundo título de liga, rompiendo una sequía de casi 20 años y abriendo paso a una nueva era gloriosa.' },
  { year: '1989', title: 'Copa Libertadores', text: 'Primer título continental de un club colombiano.', gold: true },
  { year: '1990', title: 'Recopa e Interamericana', text: 'Consolidación internacional tras la gloria de 1989.', gold: true },
  { year: '2013', title: 'Año del Triplete', text: 'Dominio absoluto en el fútbol colombiano ganando Liga y Copa.' },
  { year: '2014', title: 'Tricampeonato de Liga', text: 'Hito histórico conquistando de forma consecutiva los torneos Apertura 2013, Finalización 2013 y Apertura 2014.', gold: true},
  { year: '2016', title: 'Copa Libertadores', text: 'Segunda estrella continental.', gold: true },
  { year: '2017', title: 'Recopa Sudamericana', text: 'Consagración continental en una emotiva serie frente al Chapecoense, sellando un pacto eterno de hermandad.', gold: true },
  { year: '2022', title: 'Apertura 2022 (Fin de la sequía)', text: 'Un título crucial que se quitó un peso deencima, cortando la sequía de liga que venía desde 2017.' },
  { year: '2024', title: 'Doblete de Liga y Copa', text: 'Un cierre de año impresionante conquistando tanto la liga como la Copa Colombia.', gold: true },
  { year: '2025', title: 'Tricampeonato de Copa', text: 'Hito sin precedentes: coronándose tricampeones de la Copa Colombia venciendo consecutivamente en finales a los máximos rivales (Millonarios 2023, América 2024 y Medellín 2025).', gold: true },
]

export const honours = [
  { name: 'Copa Libertadores', count: 2 as number | null, years: '1989 · 2016', gold: true },
  { name: 'Recopa Sudamericana', count: 1 as number | null, years: '2017', gold: true },
  { name: 'Copa Interamericana', count: 2 as number | null, years: '1990 · 1997', gold: true },
  { name: 'Copa Merconorte', count: 2 as number | null, years: '1998 · 2000', gold: true},
  { name: 'Liga Colombiana', count: 18 as number, years: '1954 · 1973 · 1976 · 1981 · 1991 · 1994 · 1999 · 2005-I · 2007-I · 2007-II · 2011-I · 2013-I · 2013-II · 2014-I · 2015-II · 2017-I · 2022-I · 2024-II', gold: false },
  { name: 'Copa Colombia', count: 8 as number, years: '2012 · 2013 · 2016 · 2018 · 2021 · 2023 · 2024 · 2025', gold: false },
  { name: 'Super Liga', count: 4 as number, years:'11/12 · 15/16 · 22/23 · 24/25'},
]
