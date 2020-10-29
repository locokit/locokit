// import { Hook, HookContext } from '@feathersjs/feathers'
// import { TableColumn } from '../../models/tablecolumn.model'
// import { COLUMN_TYPE } from '@locokit/lck-glossary'

// /**
//  * Compute the formula of the columns
//  */
// export function computeRowFormulaColumns () : Hook {
//   return async (context: HookContext): Promise<HookContext> => {
//     await Promise.all(
//       (context.params._meta.columns as TableColumn[])
//         .filter(c => c.column_type_id === COLUMN_TYPE.FORMULA)
//         .map(currentColumnDefinition => {
//           if (currentColumnDefinition.settings.formula) {
//             const formula = currentColumnDefinition.settings.formula
//             // only the formula {{ $columns[columnId] }} is recognized, need a lexical parser
//             const newFormula = formula.replace(/{{\ ?\$column\['([a-z0-9\-]*)'\]\ ?}}/,
//               function replacer (match, columnId) {
//                 if (context.data.data[columnId]) {
//                   return context.data.data[columnId]
//                 } else {
//                   return ''
//                 }
//               })
//             try {
//               context.data.data[currentColumnDefinition.id] = eval(newFormula)
//             } catch (error) {
//               // TODO: historize or send to sentry
//               console.error(error)
//             }
//           } else {
//             // console.log(currentColumnDefinition.settings)
//             console.log('not yet implemented...')
//           }
//         })
//     )
//     return context
//   }
// }
