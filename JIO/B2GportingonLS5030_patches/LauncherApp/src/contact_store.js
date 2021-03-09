import BaseModule from 'base-module';
import * as utils from 'util/utils';

var filterFns = {
  contains: (a, b) => {
    a = a.toLowerCase();
    b = b.toLowerCase();
    return a.contains(b);
  },
  equality: (a, b) => {
    a = a.toLowerCase();
    b = b.toLowerCase();
    return a === b;
  }
};
/**
 * isMatch
 *
 * Validate a contact record against a list of terms by specified fields
 *
 * @param {Object} contact a contact record object.
 *
 * @param {Object} criteria fields and terms to validate a contact.
 *        - fields (fields of a contact record).
 *        - terms (terms to validate against contact record field values).
 * @param {Function} filterFn function accepts 2 arguments for
 *                             comparison.
 *
 */
function isMatch(contact, criteria, filterFn) {
  /**
   * Validation Strategy
   *
   * 1. Let _found_ be a register of confirmed terms
   * 2. Let _contact_ be a contact record.
   * 3. For each _term_ [...input list], with the label _outer_
   *   - For each _field_ of [givenName, familyName]
   *     - For each _value_ of _contact_[ _field_ ]
   *       - Let _found_[ _term_ ] be the result of calling
   *         _filterFn_( _value_, _term_).
   *         - If _found_[ _term_ ] is **true**, continue to
   *           loop labelled _outer_
   * 4. If every value of _key_ in _found_ is **true** return **true**,
   *    else return **false**
  */
  let found = {};

  /* eslint-disable */
  // The outer loop is specifically labelled to allow the
  // nested condition a way out of the second and third loop.
  outer:
  for (let i = 0, ilen = criteria.terms.length; i < ilen; i++) {
    let term = criteria.terms[i];
    for (let j = 0, jlen = criteria.fields.length; j < jlen; j++) {
      let field = criteria.fields[j];

      if (!contact[field]) {
        continue;
      }

      for (let k = 0, klen = contact[field].length; k < klen; k++) {
        let value = contact[field][k];
        if (typeof value.value !== 'undefined') {
          value = value.value;
        }

        if ((found[term] = filterFn(value.trim(), term))) {
          continue outer;
        }
      }
    }
  }
  /* eslint-enable */

  // Pending the publication of a list of ES6 features available in Firefox
  // and deemed "safe enough" for FirefoxOS development, the above code is a
  // stand-in for what should be written as:
  // outer:
  // for (var term of criteria.terms) {
  //   for (var field of criteria.fields) {
  //     for (var value of contact[field]) {
  //       if (found[term] = value.toLowerCase().contains(term)) {
  //         continue outer;
  //       }
  //     }
  //   }
  // }
  return Object.keys(found).every((key) => {
    return found[key];
  });
}

let rspaces = /\s+/;

class ContactStore extends BaseModule {
  start() {
    this.contactStore = new Map();
    //this.API = window.mozContacts || navigator.mozContacts;  // B2G-API
    this.API.addEventListener('contactchange', this);
    this.initObserver();
  }

  getContactChildren(element) {
    return element ? element.querySelectorAll('*[data-contact-number]') : [];
  }

  updateFragment(element) {
    if ('function' === typeof element.hasAttribute &&
        element.hasAttribute('data-contact-number')) {
      this.updateContact(element);
    }

    let nodes = this.getContactChildren(element);
    for (let i = 0; i < nodes.length; i++) {
      this.updateContact(nodes[i]);
    }
  }

  initObserver() {
    let moConfig = {
      attributes: true,
      characterData: false,
      childList: true,
      subtree: true,
      attributeFilter: ['data-contact-number']
    };
    let observer = new MutationObserver((mutations, self) => {
      self.disconnect();
      this.updateContacts(mutations);
      self.observe(document, moConfig);
    });
    observer.observe(document, moConfig);
  }

  updateContacts(mutations) {
    let mutation;
    let targets = new Set();

    for (let i = 0; i < mutations.length; i++) {
      mutation = mutations[i];
      if ('childList' === mutation.type) {
        let addedNode;

        for (let j = 0; j < mutation.addedNodes.length; j++) {
          addedNode = mutation.addedNodes[j];
          if (addedNode.nodeType !== Node.ELEMENT_NODE) {
            continue; // eslint-disable-line no-continue
          }
          targets.add(addedNode);
        }
      }

      if ('attributes' === mutation.type) {
        targets.add(mutation.target);
      }
    }

    targets.forEach((target) => {
      if (target.childElementCount) {
        this.updateFragment(target);
      } else if (target.dataset.contactNumber) {
        this.updateContact(target);
      }
    }, this);
  }

  updateContact(element) {
    var self = this;
    var contactNumber = element.dataset.contactNumber;

    var contactNameDOM = (
      'name' === element.dataset.contactColumn
        ? element
        : element.querySelector('[data-contact-column=name]')
    );

    var photoDOM = (
      'photo' === element.dataset.contactColumn
        ? element
        : element.querySelector('[data-contact-column=photo]')
    );

    this.findByAddress(contactNumber, (contacts) => {
      var details = utils.getContactDetails(contactNumber, contacts, { photoURL: true });

      if (contactNameDOM) {
        if (details.name) {
          if (contactNameDOM.textContent !== details.name) {
            self.debug('updating name', details, element);
            contactNameDOM.textContent = details.name;
          }
        } else if (contactNameDOM.textContent) {
          self.debug('cleaning name', details, element);
          contactNameDOM.textContent = '';
        }
      } else {
        self.debug('no contact name DOM');
      }

      if (photoDOM) {
        self.debug('updating photo', details, element);
        photoDOM.style.backgroundImage = (details.photoURL
          ? `url(${details.photoURL})`
          : null);
      } else {
        self.debug('no photo DOM');
      }
    });
  }

  _handle_contactchange(/* evt */) {
    this.updateFragment(document.body);
    this.emit('contact-changed');
  }

  findBy(filter, callback) {
    var lower = [];
    var filterValue = (filter.filterValue || '').trim();
    var terms;
    var request;
    var self = this;

    /*if (!navigator.mozContacts || !filterValue.length) {  // B2G-API
      setTimeout(() => {
        callback(
          /**
           * Bailout Strategy
           *
           * 1. A _missing_ filter.filterValue will results in an
           *    error when passed to mozContactManager.find, bailing out
           *    early avoids the additional overhead of making a
           *    request that we know will fail.
           *
           * 2. Missing navigator.mozContacts API or empty but
           *    present filter.filterValue make the app useless,
           *    so prevent unpredictable state by making the
           *    result a no-op.
           *
           */
       /*   ('undefined' === typeof filter.filterValue) ? null : [], {}
        );
      });
      return;
    }*/

    /**
     * Lookup Strategy
     *
     * 1. Create a list of terms from the filterValue string
     *
     * 2. If only 1 term, set filterValue to that term.
     *
     * 3. If more than 1 term, find the length predominate term.
     *     a. let initial be an empty string
     *       (Do not use default first item in terms, or it will not
     *       be pushed into the lowercase list)
     *     b. For each term of terms
     *         i. Push lowercased term into a list of lowercased terms
     *         ii. If the current term.length is greater then initial.length,
     *             return the term, otherwise return the initial.
     *
     * 4. If filterValue.length is < 3, set the filterLimit to 10
     *
     * 5. Remove the length predominate term from the list of validation terms
     *
     * 6. Add back the original search value, this is needed for matching
     *     multi-word queries
     *
     * 7. Make a mozContact.find request with the length predominate term
     *     as the filter.filterValue.
     *
     * 8. In the mozContactManager.find request success handler, filter the
     *     results by evaluating each contact record against
     *     the list of validation terms.
     */

    // Step 1
    terms = filterValue.split(rspaces);

    filter.filterValue = (1 === terms.length ?
      // Step 2
      terms[0] :
      // Step 3
      terms.reduce((initial, term) => {
        // Step 3.b.i
        // (used as a criteria list for isMatch)
        lower.push(term.toLowerCase());
        // Step 3.b.ii
        return term.length > initial.length ? term : initial;
      // Step 3.a
      }, '')
    );

    // Step 4
    if (filter.filterValue.length < 3) {
      filter.filterLimit = 10;
    }

    // Step 5
    lower.splice(lower.indexOf(filter.filterValue.toLowerCase()), 1);

    // Step 6
    // This would be much nicer using spread operator
    lower.push.apply(lower, terms); // eslint-disable-line prefer-spread

    // Step 7
    request = self.API.find(filter);

    request.onsuccess = function onsuccess() {
      var contacts = this.result.slice();
      var fields = ['tel', 'givenName', 'familyName'];
      var criteria = { fields: fields, terms: lower };
      var results = [];
      var contact;

      // Step 8
      if (terms.length > 1) {
        while ((contact = contacts.pop())) { // eslint-disable-line no-cond-assign
          if (isMatch(contact, criteria, filterFns.contains)) {
            results.push(contact);
          }
        }
      } else {
        results = contacts;
      }

      callback(results, {
        terms: terms
      });
    };

    request.onerror = function onerror() {
      // When an error occurs, regardless of completed count,
      // clear the onsuccess handler from this request and immediately
      // invoke the callback with a `null` argument.
      this.onsuccess = null;
      this.onerror = null;
      callback(null);
    };
  }

  findContactByString(filterValue, callback) {
    var props = ['tel', 'givenName', 'familyName'];
    return this.findBy({
      filterBy: props,
      filterOp: 'contains',
      filterValue: filterValue
    }, callback);
  }

  findExact(filterValue, callback) {
    return this.findBy({
      filterBy: ['givenName', 'familyName'],
      filterOp: 'contains',
      filterValue: filterValue
    }, (results, /* meta */) => {
      var contact = results && results.length ? results[0] : null;
      var criteria = {
        fields: ['name'],
        terms: [filterValue]
      };
      var isExact = false;

      if (contact) {
        isExact = isMatch(contact, criteria, filterFns.equality);
      }

      callback(isExact ? [contact] : []);
    });
  }

  findByPhoneNumber(filterValue, callback) {
    return this.findBy({
      filterBy: ['tel'],
      filterOp: 'match',
      filterValue: filterValue.replace(/\s+/g, '')
    },
    (results) => {
      if (results && results.length) {
        callback(results);
        return;
      }

      callback([]);
    });
  }

  findByAddress(fValue, callback) {
    this.findByPhoneNumber(fValue, callback);
  }

  findExactByEmail(fValue, callback) {
    return this.findBy({
      filterBy: ['email'],
      filterOp: 'equals',
      filterValue: fValue
    }, callback);
  }

  findById(fValue, callback) {
    return this.findBy({
      filterBy: ['id'],
      filterOp: 'equals',
      filterValue: fValue
    }, (results) => {
      let _contact = [];
      if (results && results.length) {
        _contact = results[0];
      }
      callback(_contact);
    });
  }
}

const contactStore = new ContactStore();
contactStore.start();

export default contactStore;
