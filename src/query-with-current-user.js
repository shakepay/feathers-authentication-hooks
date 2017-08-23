import get from 'lodash.get';
import set from 'lodash.set';

const defaults = {
  idField: '_id',
  as: 'userId'
};

export default function (options = {}) {
  return function (hook) {
    if (hook.type !== 'before') {
      throw new Error(`The 'queryWithCurrentUser' hook should only be used as a 'before' hook.`);
    }

    const { entity } = hook.app.get('authentication');

    if (!hook.params[entity]) {
      if (!hook.params.provider) {
        return hook;
      }

      throw new Error(`There is no current ${entity} to associate.`);
    }

    options = Object.assign({}, defaults, hook.app.get('authentication'), options);

    const id = get(hook.params[entity], options.idField);

    if (id === undefined) {
      throw new Error(`Current ${entity} is missing '${options.idField}' field.`);
    }

    set(hook.params, `query.${options.as}`, id);
  };
}
