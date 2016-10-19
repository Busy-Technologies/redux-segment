import test from 'tape';
import { compose, createStore, applyMiddleware } from 'redux';
import createAnalyticsStub from './helpers/segment-stub';
import { warn } from './helpers/console-stub';
import { createTracker, EventTypes } from '../src/index';


test('Group - spec', t => {
  t.test('default', st => {
    st.plan(2);


    window.analytics = createAnalyticsStub();
    const _oldWarn = console.warn;
    console.warn = warn;
    const EVENT_TYPE = 'JOIN_TEAM';
    const explicitAction = {
      type: EVENT_TYPE,
      meta: {
        analytics: {
          eventType: EventTypes.group,
        },
      },
    };
    const implicitAction = {
      type: EVENT_TYPE,
      meta: {
        analytics: EventTypes.group,
      },
    };
    const identity = val => val;
    const tracker = createTracker();
    const store = compose(
      applyMiddleware(tracker)
    )(createStore)(identity);


    const explicitEvent = () => store.dispatch(explicitAction);
    st.throws(explicitEvent, /missing groupId/, 'warns error when groupId prop is missing');

    const implicitEvent = () => store.dispatch(implicitAction);
    st.throws(implicitEvent, /missing groupId/, 'warms error when groupId props is missing');


    window.analytics = null;
    console.warn = _oldWarn;
  });

  t.test('groupId', st => {
    st.plan(1);


    window.analytics = createAnalyticsStub();
    const EVENT_TYPE = 'JOIN_TEAM';
    const GROUP_ID = '0PsRtFsHB0';
    const action = {
      type: EVENT_TYPE,
      meta: {
        analytics: {
          eventType: EventTypes.group,
          eventPayload: {
            groupId: GROUP_ID,
          },
        },
      },
    };
    const identity = val => val;
    const tracker = createTracker();
    const store = compose(
      applyMiddleware(tracker)
    )(createStore)(identity);


    store.dispatch(action);
    const event = [
      window.analytics[0] && window.analytics[0][0],
      window.analytics[0] && window.analytics[0][1],
    ];
    st.deepEqual(event, ['group', GROUP_ID], 'passes along the groupId of the user');


    window.analytics = null;
  });

  t.test('traits', st => {
    st.plan(1);


    window.analytics = createAnalyticsStub();
    const EVENT_TYPE = 'JOIN_TEAM';
    const GROUP_ID = '0PsRtFsHB0';
    const TRAITS = {
      email: 'user@acme.org',
      login: 'acme',
      name: 'Acme',
      type: 'organization',
    };
    const action = {
      type: EVENT_TYPE,
      meta: {
        analytics: {
          eventType: EventTypes.group,
          eventPayload: {
            groupId: GROUP_ID,
            traits: TRAITS,
          },
        },
      },
    };
    const identity = val => val;
    const tracker = createTracker();
    const store = compose(
      applyMiddleware(tracker)
    )(createStore)(identity);


    store.dispatch(action);
    const event = [
      window.analytics[0] && window.analytics[0][0],
      window.analytics[0] && window.analytics[0][1],
      window.analytics[0] && window.analytics[0][2],
    ];
    st.deepEqual(event, ['group', GROUP_ID, TRAITS], 'passes along the traits of the group');


    window.analytics = null;
  });

  t.test('options', st => {
    st.plan(2);


    window.analytics = createAnalyticsStub();
    const EVENT_TYPE = 'JOIN_TEAM';
    const GROUP_ID = '0PsRtFsHB0';
    const TRAITS = {
      email: 'user@acme.org',
      login: 'acme',
      name: 'Acme',
      type: 'organization',
    };
    const OPTIONS = {
      'All': false,
      'Mixpanel': true,
      'KISSmetrics': true,
    };
    const action = {
      type: EVENT_TYPE,
      meta: {
        analytics: {
          eventType: EventTypes.group,
          eventPayload: {
            groupId: GROUP_ID,
            traits: TRAITS,
            options: OPTIONS,
          },
        },
      },
    };
    const noTraitsAction = {
      type: EVENT_TYPE,
      meta: {
        analytics: {
          eventType: EventTypes.group,
          eventPayload: {
            groupId: GROUP_ID,
            options: OPTIONS,
          },
        },
      },
    };
    const identity = val => val;
    const tracker = createTracker();
    const store = compose(
      applyMiddleware(tracker)
    )(createStore)(identity);


    store.dispatch(action);
    const event = [
      window.analytics[0] && window.analytics[0][0],
      window.analytics[0] && window.analytics[0][1],
      window.analytics[0] && window.analytics[0][2],
      window.analytics[0] && window.analytics[0][3],
    ];
    st.deepEqual(event, ['group', GROUP_ID, TRAITS, OPTIONS], 'passes along the options of the group event');

    store.dispatch(noTraitsAction);
    const noTraitsEvent = [
      window.analytics[1] && window.analytics[1][0],
      window.analytics[1] && window.analytics[1][1],
      window.analytics[1] && window.analytics[1][2],
      window.analytics[1] && window.analytics[1][3],
    ];
    st.deepEqual(noTraitsEvent, ['group', GROUP_ID, {}, OPTIONS], 'passes along the options of the group event when no traits are provided');


    window.analytics = null;
  });
});
