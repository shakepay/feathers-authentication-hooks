import get from 'lodash.get';
import set from 'lodash.set';

const defaults = {
  idField: '_id',
  as: 'userId'
};

export default function (options = {}) {
  return function (hook) {
    if (hook.type !== 'before') {
      throw new Error(`The 'associateCurrentUser' hook should only be used as a 'before' hook.`);
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

    function setId (obj) {
      set(obj, options.as, id);
    }

    // Handle arrays.
    if (Array.isArray(hook.data)) {
      hook.data.forEach(setId);

    // Handle single objects.
    } else {
      setId(hook.data);
    }
  };
}
