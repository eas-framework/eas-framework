export declare const exampleScript = "\n'www'\n//!static/index.page:1:45 -> static/index.page.js:1:41\nimport {getNumber} from './some.hide.js';\n\n//!static/index.page:1:45 -> static/index.page.js:3:36\nexport const myNumber = getNumber();\n\nimport Moo, {a as bb, cc} from './ddd' assert {type: \"json\"}\nMoo()\na()\nbb()\ncc()\nimport 'fff'\nawait import('jdrjj')\nstop(2)\nstop\n\nexport const v = 9\nexport {a, b, c} from 'ddd'\nexport {e as k}\nexport default function me(){\n\n}\n";
export declare const exampleScriptExpectedOutput = "var _ddd = await require4('ddd');\n_export(exports, {\n    a: ()=>_ddd.a,\n    b: ()=>_ddd.b,\n    c: ()=>_ddd.c,\n    k: ()=>e,\n    default: ()=>me\n});\n'www';\n//!static/index.page:1:45 -> static/index.page.js:1:41\nvar { getNumber  } = await require4('./some.hide.js');\ngetNumber();\nvar { default: Moo , bb: a1 , cc  } = await require4('./ddd', {\n    type: \"json\"\n});\nMoo();\na();\nbb();\ncc();\nawait require4('fff');\nawait require4('jdrjj');\n_return(2);\n_return;\nfunction me() {}\n";
