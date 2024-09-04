
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }
    class HtmlTag {
        constructor(html, anchor = null) {
            this.e = element('div');
            this.a = anchor;
            this.u(html);
        }
        m(target, anchor = null) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(target, this.n[i], anchor);
            }
            this.t = target;
        }
        u(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        p(html) {
            this.d();
            this.u(html);
            this.m(this.t, this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    const seen_callbacks = new Set();
    function flush() {
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.18.1' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    /* src/components/items/ContactItem.svelte generated by Svelte v3.18.1 */

    const file = "src/components/items/ContactItem.svelte";

    // (47:1) {:else}
    function create_else_block_1(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = `${/*text*/ ctx[2]}`;
    			add_location(a, file, 46, 8, 1040);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(47:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (36:1) {#if isLink}
    function create_if_block(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*type*/ ctx[1] === "email") return create_if_block_1;
    		if (/*type*/ ctx[1] === "phone") return create_if_block_2;
    		if (/*url*/ ctx[3]) return create_if_block_3;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if_block.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(36:1) {#if isLink}",
    		ctx
    	});

    	return block;
    }

    // (43:2) {:else}
    function create_else_block(ctx) {
    	let a;
    	let t;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(/*text*/ ctx[2]);
    			attr_dev(a, "href", /*text*/ ctx[2]);
    			add_location(a, file, 43, 3, 949);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(43:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (41:16) 
    function create_if_block_3(ctx) {
    	let a;
    	let t;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(/*text*/ ctx[2]);
    			attr_dev(a, "href", /*url*/ ctx[3]);
    			add_location(a, file, 41, 3, 909);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(41:16) ",
    		ctx
    	});

    	return block;
    }

    // (39:29) 
    function create_if_block_2(ctx) {
    	let a;
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(/*text*/ ctx[2]);
    			attr_dev(a, "href", a_href_value = "tel:" + /*text*/ ctx[2]);
    			add_location(a, file, 39, 3, 857);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(39:29) ",
    		ctx
    	});

    	return block;
    }

    // (37:2) {#if type === 'email'}
    function create_if_block_1(ctx) {
    	let a;
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(/*text*/ ctx[2]);
    			attr_dev(a, "href", a_href_value = "mailto:" + /*text*/ ctx[2]);
    			add_location(a, file, 37, 3, 788);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(37:2) {#if type === 'email'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div;
    	let i;
    	let i_class_value;
    	let t;

    	function select_block_type(ctx, dirty) {
    		if (/*isLink*/ ctx[0]) return create_if_block;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			i = element("i");
    			t = space();
    			if_block.c();
    			attr_dev(i, "class", i_class_value = "" + (null_to_empty(/*linkIcon*/ ctx[4]) + " svelte-1l7nlfq"));
    			add_location(i, file, 34, 1, 723);
    			attr_dev(div, "class", "contact-item svelte-1l7nlfq");
    			add_location(div, file, 33, 0, 695);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, i);
    			append_dev(div, t);
    			if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if_block.p(ctx, dirty);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { detail } = $$props;
    	let { isLink, type, text, url, icon } = detail;
    	let defaultIcon = "fa fa-link";

    	const fontAwesomeIconMap = {
    		location: "fa fa-map-marker-alt",
    		email: "fa fa-envelope",
    		phone: "fa fa-phone-alt",
    		github: "fab fa-github",
    		linkedin: "fab fa-linkedin-in",
    		blog: "fa fa-pencil-alt"
    	};

    	let linkIcon = fontAwesomeIconMap[icon] || defaultIcon;
    	const writable_props = ["detail"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ContactItem> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("detail" in $$props) $$invalidate(5, detail = $$props.detail);
    	};

    	$$self.$capture_state = () => {
    		return {
    			detail,
    			isLink,
    			type,
    			text,
    			url,
    			icon,
    			defaultIcon,
    			linkIcon
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("detail" in $$props) $$invalidate(5, detail = $$props.detail);
    		if ("isLink" in $$props) $$invalidate(0, isLink = $$props.isLink);
    		if ("type" in $$props) $$invalidate(1, type = $$props.type);
    		if ("text" in $$props) $$invalidate(2, text = $$props.text);
    		if ("url" in $$props) $$invalidate(3, url = $$props.url);
    		if ("icon" in $$props) icon = $$props.icon;
    		if ("defaultIcon" in $$props) defaultIcon = $$props.defaultIcon;
    		if ("linkIcon" in $$props) $$invalidate(4, linkIcon = $$props.linkIcon);
    	};

    	return [isLink, type, text, url, linkIcon, detail];
    }

    class ContactItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { detail: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ContactItem",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*detail*/ ctx[5] === undefined && !("detail" in props)) {
    			console.warn("<ContactItem> was created without expected prop 'detail'");
    		}
    	}

    	get detail() {
    		throw new Error("<ContactItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set detail(value) {
    		throw new Error("<ContactItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/sections/Contact.svelte generated by Svelte v3.18.1 */
    const file$1 = "src/components/sections/Contact.svelte";

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i].subcategory;
    	child_ctx[2] = list[i].contactDetails;
    	return child_ctx;
    }

    // (43:3) {#if subcategory}
    function create_if_block$1(ctx) {
    	let div;
    	let t_value = /*subcategory*/ ctx[1] + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "contact-subhead svelte-nyldc5");
    			add_location(div, file$1, 43, 4, 755);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*details*/ 1 && t_value !== (t_value = /*subcategory*/ ctx[1] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(43:3) {#if subcategory}",
    		ctx
    	});

    	return block;
    }

    // (47:4) {#each contactDetails as detail}
    function create_each_block_1(ctx) {
    	let current;

    	const contactitem = new ContactItem({
    			props: {
    				detail: /*detail*/ ctx[5],
    				class: "contact-item"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(contactitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(contactitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const contactitem_changes = {};
    			if (dirty & /*details*/ 1) contactitem_changes.detail = /*detail*/ ctx[5];
    			contactitem.$set(contactitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(contactitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(contactitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(contactitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(47:4) {#each contactDetails as detail}",
    		ctx
    	});

    	return block;
    }

    // (41:1) {#each details as { subcategory, contactDetails }}
    function create_each_block(ctx) {
    	let div1;
    	let t0;
    	let div0;
    	let t1;
    	let current;
    	let if_block = /*subcategory*/ ctx[1] && create_if_block$1(ctx);
    	let each_value_1 = /*contactDetails*/ ctx[2];
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			if (if_block) if_block.c();
    			t0 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			attr_dev(div0, "class", "contact-items svelte-nyldc5");
    			add_location(div0, file$1, 45, 3, 816);
    			attr_dev(div1, "class", "contact-subsection svelte-nyldc5");
    			add_location(div1, file$1, 41, 2, 697);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			if (if_block) if_block.m(div1, null);
    			append_dev(div1, t0);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div1, t1);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*subcategory*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(div1, t0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*details*/ 1) {
    				each_value_1 = /*contactDetails*/ ctx[2];
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div0, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(41:1) {#each details as { subcategory, contactDetails }}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div;
    	let current;
    	let each_value = /*details*/ ctx[0];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "id", "contact-section");
    			attr_dev(div, "class", "svelte-nyldc5");
    			add_location(div, file$1, 39, 0, 616);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*details*/ 1) {
    				each_value = /*details*/ ctx[0];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { details } = $$props;
    	const writable_props = ["details"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Contact> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("details" in $$props) $$invalidate(0, details = $$props.details);
    	};

    	$$self.$capture_state = () => {
    		return { details };
    	};

    	$$self.$inject_state = $$props => {
    		if ("details" in $$props) $$invalidate(0, details = $$props.details);
    	};

    	return [details];
    }

    class Contact extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { details: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Contact",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*details*/ ctx[0] === undefined && !("details" in props)) {
    			console.warn("<Contact> was created without expected prop 'details'");
    		}
    	}

    	get details() {
    		throw new Error("<Contact>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set details(value) {
    		throw new Error("<Contact>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/items/FullDetail.svelte generated by Svelte v3.18.1 */
    const file$2 = "src/components/items/FullDetail.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    // (41:3) {#if link}
    function create_if_block_5(ctx) {
    	let current;

    	const contactitem = new ContactItem({
    			props: { detail: /*linkDetail*/ ctx[8] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(contactitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(contactitem, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(contactitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(contactitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(contactitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(41:3) {#if link}",
    		ctx
    	});

    	return block;
    }

    // (47:3) {#if dates}
    function create_if_block_3$1(ctx) {
    	let div;
    	let t;
    	let if_block = /*icon*/ ctx[3] && create_if_block_4(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t = text(/*dates*/ ctx[4]);
    			attr_dev(div, "class", "dates");
    			add_location(div, file$2, 47, 4, 885);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (/*icon*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_4(ctx);
    					if_block.c();
    					if_block.m(div, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*dates*/ 16) set_data_dev(t, /*dates*/ ctx[4]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(47:3) {#if dates}",
    		ctx
    	});

    	return block;
    }

    // (48:23) {#if icon}
    function create_if_block_4(ctx) {
    	let i;
    	let i_class_value;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = space();
    			attr_dev(i, "class", i_class_value = "" + (null_to_empty(/*icon*/ ctx[3]) + " svelte-g8spsh"));
    			add_location(i, file$2, 48, 5, 920);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*icon*/ 8 && i_class_value !== (i_class_value = "" + (null_to_empty(/*icon*/ ctx[3]) + " svelte-g8spsh"))) {
    				attr_dev(i, "class", i_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(48:23) {#if icon}",
    		ctx
    	});

    	return block;
    }

    // (52:3) {#if location}
    function create_if_block_2$1(ctx) {
    	let current;

    	const contactitem = new ContactItem({
    			props: { detail: /*locationDetail*/ ctx[9] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(contactitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(contactitem, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(contactitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(contactitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(contactitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(52:3) {#if location}",
    		ctx
    	});

    	return block;
    }

    // (58:2) {#if description}
    function create_if_block_1$1(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*description*/ ctx[6]);
    			attr_dev(div, "class", "description");
    			add_location(div, file$2, 58, 3, 1105);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*description*/ 64) set_data_dev(t, /*description*/ ctx[6]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(58:2) {#if description}",
    		ctx
    	});

    	return block;
    }

    // (61:2) {#if list}
    function create_if_block$2(ctx) {
    	let ul;
    	let each_value = /*list*/ ctx[7];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "list");
    			add_location(ul, file$2, 61, 3, 1174);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*list*/ 128) {
    				each_value = /*list*/ ctx[7];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(61:2) {#if list}",
    		ctx
    	});

    	return block;
    }

    // (63:4) {#each list as listItem}
    function create_each_block$1(ctx) {
    	let li;
    	let t_value = /*listItem*/ ctx[10] + "";
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			attr_dev(li, "class", "list-item");
    			add_location(li, file$2, 63, 5, 1226);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*list*/ 128 && t_value !== (t_value = /*listItem*/ ctx[10] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(63:4) {#each list as listItem}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div6;
    	let div4;
    	let div2;
    	let div0;
    	let t0;
    	let t1;
    	let div1;
    	let t2;
    	let t3;
    	let t4;
    	let div3;
    	let t5;
    	let t6;
    	let div5;
    	let t7;
    	let current;
    	let if_block0 = /*link*/ ctx[2] && create_if_block_5(ctx);
    	let if_block1 = /*dates*/ ctx[4] && create_if_block_3$1(ctx);
    	let if_block2 = /*location*/ ctx[5] && create_if_block_2$1(ctx);
    	let if_block3 = /*description*/ ctx[6] && create_if_block_1$1(ctx);
    	let if_block4 = /*list*/ ctx[7] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div4 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			t0 = text(/*title*/ ctx[0]);
    			t1 = space();
    			div1 = element("div");
    			t2 = text(/*subtitle*/ ctx[1]);
    			t3 = space();
    			if (if_block0) if_block0.c();
    			t4 = space();
    			div3 = element("div");
    			if (if_block1) if_block1.c();
    			t5 = space();
    			if (if_block2) if_block2.c();
    			t6 = space();
    			div5 = element("div");
    			if (if_block3) if_block3.c();
    			t7 = space();
    			if (if_block4) if_block4.c();
    			attr_dev(div0, "class", "title");
    			add_location(div0, file$2, 38, 3, 689);
    			attr_dev(div1, "class", "subtitle");
    			add_location(div1, file$2, 39, 3, 725);
    			attr_dev(div2, "class", "top-left svelte-g8spsh");
    			add_location(div2, file$2, 37, 2, 663);
    			attr_dev(div3, "class", "top-right svelte-g8spsh");
    			add_location(div3, file$2, 44, 2, 838);
    			attr_dev(div4, "class", "top svelte-g8spsh");
    			add_location(div4, file$2, 36, 1, 643);
    			attr_dev(div5, "class", "bottom");
    			add_location(div5, file$2, 56, 1, 1061);
    			attr_dev(div6, "class", "full-detail detail-container");
    			add_location(div6, file$2, 35, 0, 599);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div4);
    			append_dev(div4, div2);
    			append_dev(div2, div0);
    			append_dev(div0, t0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, t2);
    			append_dev(div2, t3);
    			if (if_block0) if_block0.m(div2, null);
    			append_dev(div4, t4);
    			append_dev(div4, div3);
    			if (if_block1) if_block1.m(div3, null);
    			append_dev(div3, t5);
    			if (if_block2) if_block2.m(div3, null);
    			append_dev(div6, t6);
    			append_dev(div6, div5);
    			if (if_block3) if_block3.m(div5, null);
    			append_dev(div5, t7);
    			if (if_block4) if_block4.m(div5, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*title*/ 1) set_data_dev(t0, /*title*/ ctx[0]);
    			if (!current || dirty & /*subtitle*/ 2) set_data_dev(t2, /*subtitle*/ ctx[1]);

    			if (/*link*/ ctx[2]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    					transition_in(if_block0, 1);
    				} else {
    					if_block0 = create_if_block_5(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div2, null);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*dates*/ ctx[4]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_3$1(ctx);
    					if_block1.c();
    					if_block1.m(div3, t5);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*location*/ ctx[5]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    					transition_in(if_block2, 1);
    				} else {
    					if_block2 = create_if_block_2$1(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div3, null);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (/*description*/ ctx[6]) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_1$1(ctx);
    					if_block3.c();
    					if_block3.m(div5, t7);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (/*list*/ ctx[7]) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);
    				} else {
    					if_block4 = create_if_block$2(ctx);
    					if_block4.c();
    					if_block4.m(div5, null);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { title } = $$props;
    	let { subtitle } = $$props;
    	let { link } = $$props;
    	let { icon } = $$props;
    	let { dates } = $$props;
    	let { location } = $$props;
    	let { description } = $$props;
    	let { list } = $$props;
    	let linkDetail = { text: link };
    	let locationDetail = { text: location, icon: "location" };

    	const writable_props = [
    		"title",
    		"subtitle",
    		"link",
    		"icon",
    		"dates",
    		"location",
    		"description",
    		"list"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<FullDetail> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("subtitle" in $$props) $$invalidate(1, subtitle = $$props.subtitle);
    		if ("link" in $$props) $$invalidate(2, link = $$props.link);
    		if ("icon" in $$props) $$invalidate(3, icon = $$props.icon);
    		if ("dates" in $$props) $$invalidate(4, dates = $$props.dates);
    		if ("location" in $$props) $$invalidate(5, location = $$props.location);
    		if ("description" in $$props) $$invalidate(6, description = $$props.description);
    		if ("list" in $$props) $$invalidate(7, list = $$props.list);
    	};

    	$$self.$capture_state = () => {
    		return {
    			title,
    			subtitle,
    			link,
    			icon,
    			dates,
    			location,
    			description,
    			list,
    			linkDetail,
    			locationDetail
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("subtitle" in $$props) $$invalidate(1, subtitle = $$props.subtitle);
    		if ("link" in $$props) $$invalidate(2, link = $$props.link);
    		if ("icon" in $$props) $$invalidate(3, icon = $$props.icon);
    		if ("dates" in $$props) $$invalidate(4, dates = $$props.dates);
    		if ("location" in $$props) $$invalidate(5, location = $$props.location);
    		if ("description" in $$props) $$invalidate(6, description = $$props.description);
    		if ("list" in $$props) $$invalidate(7, list = $$props.list);
    		if ("linkDetail" in $$props) $$invalidate(8, linkDetail = $$props.linkDetail);
    		if ("locationDetail" in $$props) $$invalidate(9, locationDetail = $$props.locationDetail);
    	};

    	return [
    		title,
    		subtitle,
    		link,
    		icon,
    		dates,
    		location,
    		description,
    		list,
    		linkDetail,
    		locationDetail
    	];
    }

    class FullDetail extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			title: 0,
    			subtitle: 1,
    			link: 2,
    			icon: 3,
    			dates: 4,
    			location: 5,
    			description: 6,
    			list: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FullDetail",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[0] === undefined && !("title" in props)) {
    			console.warn("<FullDetail> was created without expected prop 'title'");
    		}

    		if (/*subtitle*/ ctx[1] === undefined && !("subtitle" in props)) {
    			console.warn("<FullDetail> was created without expected prop 'subtitle'");
    		}

    		if (/*link*/ ctx[2] === undefined && !("link" in props)) {
    			console.warn("<FullDetail> was created without expected prop 'link'");
    		}

    		if (/*icon*/ ctx[3] === undefined && !("icon" in props)) {
    			console.warn("<FullDetail> was created without expected prop 'icon'");
    		}

    		if (/*dates*/ ctx[4] === undefined && !("dates" in props)) {
    			console.warn("<FullDetail> was created without expected prop 'dates'");
    		}

    		if (/*location*/ ctx[5] === undefined && !("location" in props)) {
    			console.warn("<FullDetail> was created without expected prop 'location'");
    		}

    		if (/*description*/ ctx[6] === undefined && !("description" in props)) {
    			console.warn("<FullDetail> was created without expected prop 'description'");
    		}

    		if (/*list*/ ctx[7] === undefined && !("list" in props)) {
    			console.warn("<FullDetail> was created without expected prop 'list'");
    		}
    	}

    	get title() {
    		throw new Error("<FullDetail>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<FullDetail>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get subtitle() {
    		throw new Error("<FullDetail>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set subtitle(value) {
    		throw new Error("<FullDetail>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get link() {
    		throw new Error("<FullDetail>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set link(value) {
    		throw new Error("<FullDetail>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon() {
    		throw new Error("<FullDetail>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<FullDetail>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dates() {
    		throw new Error("<FullDetail>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dates(value) {
    		throw new Error("<FullDetail>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get location() {
    		throw new Error("<FullDetail>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set location(value) {
    		throw new Error("<FullDetail>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get description() {
    		throw new Error("<FullDetail>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set description(value) {
    		throw new Error("<FullDetail>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get list() {
    		throw new Error("<FullDetail>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set list(value) {
    		throw new Error("<FullDetail>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/sections/FullDetails.svelte generated by Svelte v3.18.1 */
    const file$3 = "src/components/sections/FullDetails.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i].title;
    	child_ctx[2] = list[i].subtitle;
    	child_ctx[3] = list[i].link;
    	child_ctx[4] = list[i].dates;
    	child_ctx[5] = list[i].location;
    	child_ctx[6] = list[i].icon;
    	child_ctx[7] = list[i].description;
    	child_ctx[8] = list[i].list;
    	return child_ctx;
    }

    // (12:1) {#each details as { title, subtitle, link, dates, location,icon, description, list }}
    function create_each_block$2(ctx) {
    	let current;

    	const fulldetail = new FullDetail({
    			props: {
    				title: /*title*/ ctx[1],
    				subtitle: /*subtitle*/ ctx[2],
    				link: /*link*/ ctx[3],
    				icon: /*icon*/ ctx[6],
    				dates: /*dates*/ ctx[4],
    				location: /*location*/ ctx[5],
    				description: /*description*/ ctx[7],
    				list: /*list*/ ctx[8]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(fulldetail.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fulldetail, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const fulldetail_changes = {};
    			if (dirty & /*details*/ 1) fulldetail_changes.title = /*title*/ ctx[1];
    			if (dirty & /*details*/ 1) fulldetail_changes.subtitle = /*subtitle*/ ctx[2];
    			if (dirty & /*details*/ 1) fulldetail_changes.link = /*link*/ ctx[3];
    			if (dirty & /*details*/ 1) fulldetail_changes.icon = /*icon*/ ctx[6];
    			if (dirty & /*details*/ 1) fulldetail_changes.dates = /*dates*/ ctx[4];
    			if (dirty & /*details*/ 1) fulldetail_changes.location = /*location*/ ctx[5];
    			if (dirty & /*details*/ 1) fulldetail_changes.description = /*description*/ ctx[7];
    			if (dirty & /*details*/ 1) fulldetail_changes.list = /*list*/ ctx[8];
    			fulldetail.$set(fulldetail_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fulldetail.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fulldetail.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fulldetail, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(12:1) {#each details as { title, subtitle, link, dates, location,icon, description, list }}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let current;
    	let each_value = /*details*/ ctx[0];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "ok svelte-bmevu5");
    			add_location(div, file$3, 10, 0, 188);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*details*/ 1) {
    				each_value = /*details*/ ctx[0];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { details } = $$props;
    	const writable_props = ["details"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<FullDetails> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("details" in $$props) $$invalidate(0, details = $$props.details);
    	};

    	$$self.$capture_state = () => {
    		return { details };
    	};

    	$$self.$inject_state = $$props => {
    		if ("details" in $$props) $$invalidate(0, details = $$props.details);
    	};

    	return [details];
    }

    class FullDetails extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { details: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FullDetails",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*details*/ ctx[0] === undefined && !("details" in props)) {
    			console.warn("<FullDetails> was created without expected prop 'details'");
    		}
    	}

    	get details() {
    		throw new Error("<FullDetails>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set details(value) {
    		throw new Error("<FullDetails>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/items/SimpleDetail.svelte generated by Svelte v3.18.1 */
    const file$4 = "src/components/items/SimpleDetail.svelte";

    // (50:2) {#if subtitle}
    function create_if_block_2$2(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*subtitle*/ ctx[1]);
    			attr_dev(div, "class", "subtitle svelte-1fag6bl");
    			add_location(div, file$4, 50, 3, 712);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*subtitle*/ 2) set_data_dev(t, /*subtitle*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(50:2) {#if subtitle}",
    		ctx
    	});

    	return block;
    }

    // (53:4) {#if link}
    function create_if_block_1$2(ctx) {
    	let current;

    	const contactitem = new ContactItem({
    			props: { detail: /*detail*/ ctx[4] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(contactitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(contactitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const contactitem_changes = {};
    			if (dirty & /*detail*/ 16) contactitem_changes.detail = /*detail*/ ctx[4];
    			contactitem.$set(contactitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(contactitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(contactitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(contactitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(53:4) {#if link}",
    		ctx
    	});

    	return block;
    }

    // (58:2) {#if description}
    function create_if_block$3(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*description*/ ctx[3]);
    			attr_dev(div, "class", "description");
    			add_location(div, file$4, 58, 3, 868);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*description*/ 8) set_data_dev(t, /*description*/ ctx[3]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(58:2) {#if description}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div3;
    	let div1;
    	let div0;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let div2;
    	let current;
    	let if_block0 = /*subtitle*/ ctx[1] && create_if_block_2$2(ctx);
    	let if_block1 = /*link*/ ctx[2] && create_if_block_1$2(ctx);
    	let if_block2 = /*description*/ ctx[3] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text(/*title*/ ctx[0]);
    			t1 = space();
    			if (if_block0) if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			div2 = element("div");
    			if (if_block2) if_block2.c();
    			attr_dev(div0, "class", "title");
    			add_location(div0, file$4, 48, 2, 659);
    			attr_dev(div1, "class", "top svelte-1fag6bl");
    			add_location(div1, file$4, 47, 1, 639);
    			attr_dev(div2, "class", "bottom");
    			add_location(div2, file$4, 56, 1, 824);
    			attr_dev(div3, "class", "simple-detail detail-container svelte-1fag6bl");
    			add_location(div3, file$4, 46, 0, 593);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div1);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			append_dev(div1, t1);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div1, t2);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div3, t3);
    			append_dev(div3, div2);
    			if (if_block2) if_block2.m(div2, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*title*/ 1) set_data_dev(t0, /*title*/ ctx[0]);

    			if (/*subtitle*/ ctx[1]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_2$2(ctx);
    					if_block0.c();
    					if_block0.m(div1, t2);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*link*/ ctx[2]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    					transition_in(if_block1, 1);
    				} else {
    					if_block1 = create_if_block_1$2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div1, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*description*/ ctx[3]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block$3(ctx);
    					if_block2.c();
    					if_block2.m(div2, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { title } = $$props;
    	let { subtitle } = $$props;
    	let { url } = $$props;
    	let { link } = $$props;
    	let { icon } = $$props;
    	let { description } = $$props;

    	let { detail = {
    		isLink: true,
    		type: "web",
    		icon,
    		url,
    		text: link
    	} } = $$props;

    	const writable_props = ["title", "subtitle", "url", "link", "icon", "description", "detail"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SimpleDetail> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("subtitle" in $$props) $$invalidate(1, subtitle = $$props.subtitle);
    		if ("url" in $$props) $$invalidate(5, url = $$props.url);
    		if ("link" in $$props) $$invalidate(2, link = $$props.link);
    		if ("icon" in $$props) $$invalidate(6, icon = $$props.icon);
    		if ("description" in $$props) $$invalidate(3, description = $$props.description);
    		if ("detail" in $$props) $$invalidate(4, detail = $$props.detail);
    	};

    	$$self.$capture_state = () => {
    		return {
    			title,
    			subtitle,
    			url,
    			link,
    			icon,
    			description,
    			detail
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("subtitle" in $$props) $$invalidate(1, subtitle = $$props.subtitle);
    		if ("url" in $$props) $$invalidate(5, url = $$props.url);
    		if ("link" in $$props) $$invalidate(2, link = $$props.link);
    		if ("icon" in $$props) $$invalidate(6, icon = $$props.icon);
    		if ("description" in $$props) $$invalidate(3, description = $$props.description);
    		if ("detail" in $$props) $$invalidate(4, detail = $$props.detail);
    	};

    	return [title, subtitle, link, description, detail, url, icon];
    }

    class SimpleDetail extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			title: 0,
    			subtitle: 1,
    			url: 5,
    			link: 2,
    			icon: 6,
    			description: 3,
    			detail: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SimpleDetail",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[0] === undefined && !("title" in props)) {
    			console.warn("<SimpleDetail> was created without expected prop 'title'");
    		}

    		if (/*subtitle*/ ctx[1] === undefined && !("subtitle" in props)) {
    			console.warn("<SimpleDetail> was created without expected prop 'subtitle'");
    		}

    		if (/*url*/ ctx[5] === undefined && !("url" in props)) {
    			console.warn("<SimpleDetail> was created without expected prop 'url'");
    		}

    		if (/*link*/ ctx[2] === undefined && !("link" in props)) {
    			console.warn("<SimpleDetail> was created without expected prop 'link'");
    		}

    		if (/*icon*/ ctx[6] === undefined && !("icon" in props)) {
    			console.warn("<SimpleDetail> was created without expected prop 'icon'");
    		}

    		if (/*description*/ ctx[3] === undefined && !("description" in props)) {
    			console.warn("<SimpleDetail> was created without expected prop 'description'");
    		}
    	}

    	get title() {
    		throw new Error("<SimpleDetail>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<SimpleDetail>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get subtitle() {
    		throw new Error("<SimpleDetail>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set subtitle(value) {
    		throw new Error("<SimpleDetail>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<SimpleDetail>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<SimpleDetail>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get link() {
    		throw new Error("<SimpleDetail>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set link(value) {
    		throw new Error("<SimpleDetail>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon() {
    		throw new Error("<SimpleDetail>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<SimpleDetail>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get description() {
    		throw new Error("<SimpleDetail>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set description(value) {
    		throw new Error("<SimpleDetail>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get detail() {
    		throw new Error("<SimpleDetail>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set detail(value) {
    		throw new Error("<SimpleDetail>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/sections/SimpleDetails.svelte generated by Svelte v3.18.1 */
    const file$5 = "src/components/sections/SimpleDetails.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i].title;
    	child_ctx[2] = list[i].subtitle;
    	child_ctx[3] = list[i].icon;
    	child_ctx[4] = list[i].url;
    	child_ctx[5] = list[i].link;
    	child_ctx[6] = list[i].description;
    	return child_ctx;
    }

    // (12:4) {#each details as { title, subtitle, icon, url, link, description }}
    function create_each_block$3(ctx) {
    	let current;

    	const simpledetail = new SimpleDetail({
    			props: {
    				title: /*title*/ ctx[1],
    				subtitle: /*subtitle*/ ctx[2],
    				icon: /*icon*/ ctx[3],
    				url: /*url*/ ctx[4],
    				link: /*link*/ ctx[5],
    				description: /*description*/ ctx[6]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(simpledetail.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(simpledetail, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const simpledetail_changes = {};
    			if (dirty & /*details*/ 1) simpledetail_changes.title = /*title*/ ctx[1];
    			if (dirty & /*details*/ 1) simpledetail_changes.subtitle = /*subtitle*/ ctx[2];
    			if (dirty & /*details*/ 1) simpledetail_changes.icon = /*icon*/ ctx[3];
    			if (dirty & /*details*/ 1) simpledetail_changes.url = /*url*/ ctx[4];
    			if (dirty & /*details*/ 1) simpledetail_changes.link = /*link*/ ctx[5];
    			if (dirty & /*details*/ 1) simpledetail_changes.description = /*description*/ ctx[6];
    			simpledetail.$set(simpledetail_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(simpledetail.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(simpledetail.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(simpledetail, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(12:4) {#each details as { title, subtitle, icon, url, link, description }}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let current;
    	let each_value = /*details*/ ctx[0];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "ok svelte-1mk7fuj");
    			add_location(div, file$5, 10, 2, 220);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*details*/ 1) {
    				each_value = /*details*/ ctx[0];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { details } = $$props;
    	const writable_props = ["details"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SimpleDetails> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("details" in $$props) $$invalidate(0, details = $$props.details);
    	};

    	$$self.$capture_state = () => {
    		return { details };
    	};

    	$$self.$inject_state = $$props => {
    		if ("details" in $$props) $$invalidate(0, details = $$props.details);
    	};

    	return [details];
    }

    class SimpleDetails extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { details: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SimpleDetails",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*details*/ ctx[0] === undefined && !("details" in props)) {
    			console.warn("<SimpleDetails> was created without expected prop 'details'");
    		}
    	}

    	get details() {
    		throw new Error("<SimpleDetails>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set details(value) {
    		throw new Error("<SimpleDetails>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/items/Skill.svelte generated by Svelte v3.18.1 */

    const file$6 = "src/components/items/Skill.svelte";

    function create_fragment$6(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			t0 = space();
    			t1 = text(/*skillName*/ ctx[0]);
    			attr_dev(img, "width", "20");
    			attr_dev(img, "height", "20");
    			if (img.src !== (img_src_value = /*skillImage*/ ctx[1])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-1wl2oum");
    			add_location(img, file$6, 26, 19, 558);
    			attr_dev(div, "class", "skill svelte-1wl2oum");
    			add_location(div, file$6, 26, 0, 539);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			append_dev(div, t0);
    			append_dev(div, t1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*skillImage*/ 2 && img.src !== (img_src_value = /*skillImage*/ ctx[1])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*skillName*/ 1) set_data_dev(t1, /*skillName*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { skillName } = $$props;
    	let { skillImage } = $$props;
    	const writable_props = ["skillName", "skillImage"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Skill> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("skillName" in $$props) $$invalidate(0, skillName = $$props.skillName);
    		if ("skillImage" in $$props) $$invalidate(1, skillImage = $$props.skillImage);
    	};

    	$$self.$capture_state = () => {
    		return { skillName, skillImage };
    	};

    	$$self.$inject_state = $$props => {
    		if ("skillName" in $$props) $$invalidate(0, skillName = $$props.skillName);
    		if ("skillImage" in $$props) $$invalidate(1, skillImage = $$props.skillImage);
    	};

    	return [skillName, skillImage];
    }

    class Skill extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { skillName: 0, skillImage: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Skill",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*skillName*/ ctx[0] === undefined && !("skillName" in props)) {
    			console.warn("<Skill> was created without expected prop 'skillName'");
    		}

    		if (/*skillImage*/ ctx[1] === undefined && !("skillImage" in props)) {
    			console.warn("<Skill> was created without expected prop 'skillImage'");
    		}
    	}

    	get skillName() {
    		throw new Error("<Skill>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set skillName(value) {
    		throw new Error("<Skill>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get skillImage() {
    		throw new Error("<Skill>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set skillImage(value) {
    		throw new Error("<Skill>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/sections/Skills.svelte generated by Svelte v3.18.1 */
    const file$7 = "src/components/sections/Skills.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (20:1) {#each details as skill}
    function create_each_block$4(ctx) {
    	let current;

    	const skill = new Skill({
    			props: {
    				skillImage: /*skill*/ ctx[1][0],
    				skillName: /*skill*/ ctx[1][1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(skill.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(skill, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const skill_changes = {};
    			if (dirty & /*details*/ 1) skill_changes.skillImage = /*skill*/ ctx[1][0];
    			if (dirty & /*details*/ 1) skill_changes.skillName = /*skill*/ ctx[1][1];
    			skill.$set(skill_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(skill.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(skill.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(skill, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(20:1) {#each details as skill}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div;
    	let current;
    	let each_value = /*details*/ ctx[0];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "id", "skills-section");
    			attr_dev(div, "class", "svelte-17w2jlc");
    			add_location(div, file$7, 18, 0, 341);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*details*/ 1) {
    				each_value = /*details*/ ctx[0];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { details } = $$props;
    	const writable_props = ["details"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Skills> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("details" in $$props) $$invalidate(0, details = $$props.details);
    	};

    	$$self.$capture_state = () => {
    		return { details };
    	};

    	$$self.$inject_state = $$props => {
    		if ("details" in $$props) $$invalidate(0, details = $$props.details);
    	};

    	return [details];
    }

    class Skills extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { details: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Skills",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*details*/ ctx[0] === undefined && !("details" in props)) {
    			console.warn("<Skills> was created without expected prop 'details'");
    		}
    	}

    	get details() {
    		throw new Error("<Skills>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set details(value) {
    		throw new Error("<Skills>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/structural/Section.svelte generated by Svelte v3.18.1 */
    const file$8 = "src/components/structural/Section.svelte";

    // (20:30) 
    function create_if_block_3$2(ctx) {
    	let current;

    	const contact = new Contact({
    			props: {
    				label: /*label*/ ctx[0],
    				details: /*details*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(contact.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(contact, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const contact_changes = {};
    			if (dirty & /*label*/ 1) contact_changes.label = /*label*/ ctx[0];
    			if (dirty & /*details*/ 2) contact_changes.details = /*details*/ ctx[1];
    			contact.$set(contact_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(contact.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(contact.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(contact, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(20:30) ",
    		ctx
    	});

    	return block;
    }

    // (18:29) 
    function create_if_block_2$3(ctx) {
    	let current;

    	const skills = new Skills({
    			props: {
    				label: /*label*/ ctx[0],
    				details: /*details*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(skills.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(skills, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const skills_changes = {};
    			if (dirty & /*label*/ 1) skills_changes.label = /*label*/ ctx[0];
    			if (dirty & /*details*/ 2) skills_changes.details = /*details*/ ctx[1];
    			skills.$set(skills_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(skills.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(skills.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(skills, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(18:29) ",
    		ctx
    	});

    	return block;
    }

    // (16:35) 
    function create_if_block_1$3(ctx) {
    	let current;

    	const fulldetails = new FullDetails({
    			props: {
    				label: /*label*/ ctx[0],
    				details: /*details*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(fulldetails.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fulldetails, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const fulldetails_changes = {};
    			if (dirty & /*label*/ 1) fulldetails_changes.label = /*label*/ ctx[0];
    			if (dirty & /*details*/ 2) fulldetails_changes.details = /*details*/ ctx[1];
    			fulldetails.$set(fulldetails_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fulldetails.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fulldetails.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fulldetails, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(16:35) ",
    		ctx
    	});

    	return block;
    }

    // (14:1) {#if type === 'simple-details'}
    function create_if_block$4(ctx) {
    	let current;

    	const simpledetails = new SimpleDetails({
    			props: {
    				label: /*label*/ ctx[0],
    				details: /*details*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(simpledetails.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(simpledetails, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const simpledetails_changes = {};
    			if (dirty & /*label*/ 1) simpledetails_changes.label = /*label*/ ctx[0];
    			if (dirty & /*details*/ 2) simpledetails_changes.details = /*details*/ ctx[1];
    			simpledetails.$set(simpledetails_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(simpledetails.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(simpledetails.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(simpledetails, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(14:1) {#if type === 'simple-details'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div;
    	let h2;
    	let t0;
    	let t1;
    	let hr;
    	let t2;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$4, create_if_block_1$3, create_if_block_2$3, create_if_block_3$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*type*/ ctx[2] === "simple-details") return 0;
    		if (/*type*/ ctx[2] === "full-details") return 1;
    		if (/*type*/ ctx[2] === "skills") return 2;
    		if (/*type*/ ctx[2] === "contact") return 3;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			t0 = text(/*label*/ ctx[0]);
    			t1 = space();
    			hr = element("hr");
    			t2 = space();
    			if (if_block) if_block.c();
    			attr_dev(h2, "class", "section-label");
    			add_location(h2, file$8, 11, 1, 323);
    			attr_dev(hr, "class", "section-underline");
    			add_location(hr, file$8, 12, 1, 363);
    			attr_dev(div, "class", "section");
    			add_location(div, file$8, 10, 0, 300);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(h2, t0);
    			append_dev(div, t1);
    			append_dev(div, hr);
    			append_dev(div, t2);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*label*/ 1) set_data_dev(t0, /*label*/ ctx[0]);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					}

    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { label } = $$props;
    	let { details } = $$props;
    	let { type } = $$props;
    	const writable_props = ["label", "details", "type"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Section> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("label" in $$props) $$invalidate(0, label = $$props.label);
    		if ("details" in $$props) $$invalidate(1, details = $$props.details);
    		if ("type" in $$props) $$invalidate(2, type = $$props.type);
    	};

    	$$self.$capture_state = () => {
    		return { label, details, type };
    	};

    	$$self.$inject_state = $$props => {
    		if ("label" in $$props) $$invalidate(0, label = $$props.label);
    		if ("details" in $$props) $$invalidate(1, details = $$props.details);
    		if ("type" in $$props) $$invalidate(2, type = $$props.type);
    	};

    	return [label, details, type];
    }

    class Section extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { label: 0, details: 1, type: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Section",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*label*/ ctx[0] === undefined && !("label" in props)) {
    			console.warn("<Section> was created without expected prop 'label'");
    		}

    		if (/*details*/ ctx[1] === undefined && !("details" in props)) {
    			console.warn("<Section> was created without expected prop 'details'");
    		}

    		if (/*type*/ ctx[2] === undefined && !("type" in props)) {
    			console.warn("<Section> was created without expected prop 'type'");
    		}
    	}

    	get label() {
    		throw new Error("<Section>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Section>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get details() {
    		throw new Error("<Section>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set details(value) {
    		throw new Error("<Section>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<Section>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Section>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/structural/MainColumn.svelte generated by Svelte v3.18.1 */
    const file$9 = "src/components/structural/MainColumn.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i].label;
    	child_ctx[2] = list[i].details;
    	child_ctx[3] = list[i].type;
    	return child_ctx;
    }

    // (7:1) {#each sections as { label, details, type }}
    function create_each_block$5(ctx) {
    	let current;

    	const section = new Section({
    			props: {
    				label: /*label*/ ctx[1],
    				details: /*details*/ ctx[2],
    				type: /*type*/ ctx[3]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(section.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(section, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const section_changes = {};
    			if (dirty & /*sections*/ 1) section_changes.label = /*label*/ ctx[1];
    			if (dirty & /*sections*/ 1) section_changes.details = /*details*/ ctx[2];
    			if (dirty & /*sections*/ 1) section_changes.type = /*type*/ ctx[3];
    			section.$set(section_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(section.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(section.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(section, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(7:1) {#each sections as { label, details, type }}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div;
    	let current;
    	let each_value = /*sections*/ ctx[0];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "id", "main-column");
    			attr_dev(div, "class", "svelte-zr1u7z");
    			add_location(div, file$9, 5, 0, 84);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*sections*/ 1) {
    				each_value = /*sections*/ ctx[0];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { sections } = $$props;
    	const writable_props = ["sections"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<MainColumn> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("sections" in $$props) $$invalidate(0, sections = $$props.sections);
    	};

    	$$self.$capture_state = () => {
    		return { sections };
    	};

    	$$self.$inject_state = $$props => {
    		if ("sections" in $$props) $$invalidate(0, sections = $$props.sections);
    	};

    	return [sections];
    }

    class MainColumn extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { sections: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MainColumn",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*sections*/ ctx[0] === undefined && !("sections" in props)) {
    			console.warn("<MainColumn> was created without expected prop 'sections'");
    		}
    	}

    	get sections() {
    		throw new Error("<MainColumn>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sections(value) {
    		throw new Error("<MainColumn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/structural/SideColumn.svelte generated by Svelte v3.18.1 */
    const file$a = "src/components/structural/SideColumn.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i].label;
    	child_ctx[2] = list[i].details;
    	child_ctx[3] = list[i].type;
    	return child_ctx;
    }

    // (7:1) {#each sections as { label, details, type }}
    function create_each_block$6(ctx) {
    	let current;

    	const section = new Section({
    			props: {
    				label: /*label*/ ctx[1],
    				details: /*details*/ ctx[2],
    				type: /*type*/ ctx[3]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(section.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(section, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const section_changes = {};
    			if (dirty & /*sections*/ 1) section_changes.label = /*label*/ ctx[1];
    			if (dirty & /*sections*/ 1) section_changes.details = /*details*/ ctx[2];
    			if (dirty & /*sections*/ 1) section_changes.type = /*type*/ ctx[3];
    			section.$set(section_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(section.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(section.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(section, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(7:1) {#each sections as { label, details, type }}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div;
    	let current;
    	let each_value = /*sections*/ ctx[0];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "id", "side-column");
    			attr_dev(div, "class", "svelte-19wiboh");
    			add_location(div, file$a, 5, 0, 83);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*sections*/ 1) {
    				each_value = /*sections*/ ctx[0];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { sections } = $$props;
    	const writable_props = ["sections"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SideColumn> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("sections" in $$props) $$invalidate(0, sections = $$props.sections);
    	};

    	$$self.$capture_state = () => {
    		return { sections };
    	};

    	$$self.$inject_state = $$props => {
    		if ("sections" in $$props) $$invalidate(0, sections = $$props.sections);
    	};

    	return [sections];
    }

    class SideColumn extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { sections: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SideColumn",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*sections*/ ctx[0] === undefined && !("sections" in props)) {
    			console.warn("<SideColumn> was created without expected prop 'sections'");
    		}
    	}

    	get sections() {
    		throw new Error("<SideColumn>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sections(value) {
    		throw new Error("<SideColumn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/structural/Body.svelte generated by Svelte v3.18.1 */
    const file$b = "src/components/structural/Body.svelte";

    function create_fragment$b(ctx) {
    	let div;
    	let t;
    	let current;

    	const maincolumn = new MainColumn({
    			props: { sections: /*mainColumn*/ ctx[1] },
    			$$inline: true
    		});

    	const sidecolumn = new SideColumn({
    			props: { sections: /*sideColumn*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(maincolumn.$$.fragment);
    			t = space();
    			create_component(sidecolumn.$$.fragment);
    			attr_dev(div, "class", "main-body svelte-sc6yfg");
    			add_location(div, file$b, 256, 0, 8736);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(maincolumn, div, null);
    			append_dev(div, t);
    			mount_component(sidecolumn, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(maincolumn.$$.fragment, local);
    			transition_in(sidecolumn.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(maincolumn.$$.fragment, local);
    			transition_out(sidecolumn.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(maincolumn);
    			destroy_component(sidecolumn);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	const sideColumn = [
    		{
    			type: "contact",
    			label: "Contact",
    			details: [
    				{
    					subcategory: "",
    					contactDetails: [
    						{
    							isLink: true,
    							type: "email",
    							text: "ilavarasans@protonmail.com",
    							icon: "email"
    						},
    						{
    							isLink: true,
    							type: "phone",
    							text: "9080494637",
    							icon: "phone"
    						},
    						{
    							text: "Coimbatore, Tamil Nadu",
    							icon: "location"
    						}
    					]
    				},
    				{
    					subcategory: "",
    					contactDetails: [
    						{
    							isLink: true,
    							type: "web",
    							url: "https://github.com/EphemeralSapient/",
    							text: "EphemeralSapient",
    							icon: "github"
    						},
    						{
    							isLink: true,
    							type: "web",
    							url: "https://www.linkedin.com/in/ilavarasan-sampath-789372269",
    							text: "Ilavarasan Sampath",
    							icon: "linkedin"
    						}
    					]
    				}
    			]
    		},
    		{
    			type: "skills",
    			label: "Skills",
    			details: [
    				["/resumed/png/flutter.png", "Flutter"],
    				["/resumed/png/react.png", "React"],
    				["/resumed/png/python.png", "Python"],
    				["/resumed/png/rust.png", "Rust"],
    				["/resumed/png/linux.png", "Linux"],
    				["/resumed/png/azure.png", "Azure"],
    				["/resumed/png/mysql.png", "MySQL"],
    				["/resumed/png/mongo-db.png", "MongoDB"]
    			]
    		},
    		{
    			type: "simple-details",
    			label: "Certifications",
    			details: [
    				{
    					title: "Azure Fundamentals",
    					url: "https://learn.microsoft.com/api/credentials/share/en-gb/Ilavarasan-1337/9C12269E726BF964?sharingId=C69126F94A5ADC61",
    					link: "View certification page",
    					description: "Microsoft AZ-900: Azure Fundamentals certification."
    				},
    				{
    					title: "Infosys Springboard",
    					url: "https://drive.google.com/file/d/1FgUJkFb2odlGftiJtFyf7R7YiECGk03w/view?usp=sharing",
    					link: "View certification",
    					description: "An online course of Data Structures and Algorithms using Java."
    				}
    			]
    		}
    	];

    	const mainColumn = [
    		// {
    		// 	type: 'full-details',
    		// 	label: 'Education',
    		// 	details: [
    		// 		{
    		// 			title: 'Contract Full Stack Developer',
    		// 			subtitle: 'The Wally Shop',
    		// 			dates: `4/2019 — ongoing`,
    		// 			location: 'Remote',
    		// 			description: 'Reusable packaging grocery delivery service',
    		// 			list: [
    		// 				'Update and add new features to customer-facing e-commerce app using React with MobX and Bootstrap.',
    		// 				'Implement NodeJS API endpoints using MongoDB queries.',
    		// 				'Execute miscellaneous technical projects such as auto-generating unique PDFs from a graphics file.',
    		// 				// 'Implement product rating system to handle both numerical reviews and comments',
    		// 				// Use React.js to add prompts and visual cues for shoppers to update product and inventory information.
    		// 				// Contracted to develop tech stack focused on MongoDB, Express.js, React, Node.js.
    		// 			],
    		// 		},
    		// 		{
    		// 			title: 'Front End Developer',
    		// 			subtitle: 'Sixcycle',
    		// 			dates: '4/2019 — 10/2019',
    		// 			location: 'Brooklyn, NY',
    		// 			description: 'Endurance coaching software used by Team in Training',
    		// 			list: [
    		// 				'Maintained primary ownership of the front end of a React / JavaScript SaaS web app used by thousands of coaches and athletes daily.',
    		// 				'Implemented new features from InVision prototypes, including message templates and public community groups.',
    		// 				'Improved stability through bug fixes and refactoring to reduce tech debt.',
    		// 			],
    		// 		},
    		// 		{
    		// 			title: 'Math Fellow, Americorps',
    		// 			subtitle: 'Denver Public Schools',
    		// 			dates: '2017 — 2018',
    		// 			location: 'Denver, CO',
    		// 			description: 'Middle school math intervention program',
    		// 			list: [
    		// 				'Improved academic outcomes for a diverse student population by creating and teaching lesson plans that included original worksheets and activities.',
    		// 				'Developed a positive motivation system to encourage on-task behavior, teamwork, and delaying of rewards.',
    		// 				'Launched and led HTML coding enrichment class with Galvanize students.',
    		// 				// • Taught small-group 6th grade math intervention, writing and delivering original lessons.
    		// 				// • Managed behavior and relationships with a positive motivation system, restorative conversations, and supplemental tutoring.
    		// 				// • Facilitated an elective with Galvanize where students learned HTML and built websites (deployed and hosted by Galvanize).
    		// 			],
    		// 		},
    		// 		{
    		// 			title: 'Technical Writer',
    		// 			subtitle: 'KBC Advanced Technologies',
    		// 			dates: '2014 — 2015',
    		// 			location: 'Denver, CO',
    		// 			description: 'Oil refinery operations manuals',
    		// 			list: [
    		// 				'Produced high quality training manuals that included written content and Visio drawings, synthesizing information from various sources.',
    		// 			],
    		// 		},
    		// 		// Linkedin
    		// 			// 'Produced high quality training manuals for oil refinery operations to communicate how materials move through complex systems.',
    		// 			// 'Wrote clear, concise content with information compiled from client documents, photos, and detailed flow diagrams.'
    		// 			// 'Created Visio drawings of condensed stream and equipment information to assist with visual understanding.',
    		// 		// Honeybee Robotics, New York, NY
    		// 		// Operations Associate, 2012–2013
    		// 		// • Controlled project document streams and managed all incoming bills, serving as the main point of contact for vendors.
    		// 		// • Created a macro in Excel VBA to automate entry and processing of expense data.
    		// 		// • Updated and expanded company website and blog using Joomla!
    		// 	],
    		// },
    		{
    			type: "full-details",
    			label: "Education",
    			details: [
    				{
    					title: "B.E. Computer Science and Engineering",
    					subtitle: "Dr. N.G.P. Institute of Technology",
    					dates: "2021—2025",
    					description: "CGPA: 8.1 [until 6th semester]",
    					location: "Kalapatti"
    				},
    				{ title: " ", subtitle: " " },
    				{
    					title: "Higher Secondary School",
    					subtitle: "Perks Matriculation Higher Secondary School",
    					description: "Percentage: 78%",
    					dates: "2020 — 2021",
    					location: "Singanallur"
    				}
    			]
    		},
    		{
    			type: "full-details",
    			label: "Projects",
    			details: [
    				{
    					title: "Project Prism",
    					subtitle: "",
    					icon: "fab fa-github",
    					dates: "Github",
    					description: "A modular and comprehensive application [Flutter, React]",
    					list: [
    						"Smart attendance system using face recognition",
    						"Education management system for students and teachers",
    						"Supports both on-premises and cloud deployment",
    						"Intuitive UI/UX design by web and mobile application support"
    					]
    				},
    				{
    					title: "Mini Projects",
    					subtitle: "",
    					icon: "fab fa-github",
    					dates: "Github",
    					description: "Various mini projects for learning and exploring new technologies",
    					list: [
    						"Score board controller using UART communication - Flutter",
    						"Pastebin alike app with Tonic[Rust] and React - semp.myftp.org/txts",
    						"Gemini and ChatGPT API integration on communication platform - Nodejs"
    					]
    				}
    			], // {title:" ",subtitle:" "},
    			// {
    			
    		},
    		// 	subtitle: '',
    		// 	description: 'It is android specific application made for controlling the scoreboard using UART communication devices such as, HC-05.',
    		// 	dates: 'Github',
    		// 	list: [
    		// 		"Control the scoreboard using bluetooth [HC-05]",
    		// 		"Sleek UI/UX design with login menu",
    		// 		"Provides set of game mode templates",
    		// 		"Supports both rotation and different themes",
    		// 		"Easily customizable and add new game modes",
    		// 	]
    		// },
    		{
    			type: "simple-details", // 	title: 'UART Scoreboard Controller',
    			label: "Internship",
    			details: [
    				{
    					title: "Zoho Corporation",
    					url: "https://drive.google.com/file/d/1Jv26DPK8yOZXYTMeDG_p96y53iPtxlLe/view?usp=sharing",
    					link: "Summer Intern [Feb 2024 - April 2024]",
    					description: "Worked on the few projects for Zoho Cliq Extension integrations."
    				}
    			], // {
    			// 	title: 'Teknozura 2k23',
    			
    		}
    	]; // 	url: 'https://drive.google.com/file/d/1tneurbWzscqCw3Nf7DvBeooDcSjX_Ehf/view?usp=sharing',
    	// 	link: '24 Hour Hackathon',
    	// 	description:
    	// 		'Secured 1st place in 24 Hour Hackathon event organized by IEEE Student Branch.',

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		
    	};

    	return [sideColumn, mainColumn];
    }

    class Body extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { sideColumn: 0, mainColumn: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Body",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get sideColumn() {
    		return this.$$.ctx[0];
    	}

    	set sideColumn(value) {
    		throw new Error("<Body>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get mainColumn() {
    		return this.$$.ctx[1];
    	}

    	set mainColumn(value) {
    		throw new Error("<Body>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/structural/Header.svelte generated by Svelte v3.18.1 */

    const file$c = "src/components/structural/Header.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	child_ctx[4] = i;
    	return child_ctx;
    }

    // (42:2) {#each summaryLines as line, i}
    function create_each_block$7(ctx) {
    	let div;
    	let html_tag;
    	let raw_value = /*line*/ ctx[2] + "";
    	let t;
    	let div_class_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = space();
    			html_tag = new HtmlTag(raw_value, t);
    			attr_dev(div, "class", div_class_value = "summary-line-" + /*i*/ ctx[4] + " svelte-q0r1mi");
    			add_location(div, file$c, 42, 3, 994);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			html_tag.m(div);
    			append_dev(div, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(42:2) {#each summaryLines as line, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let div1;
    	let h1;
    	let t1;
    	let div0;
    	let each_value = /*summaryLines*/ ctx[1];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = `${/*name*/ ctx[0]}`;
    			t1 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h1, "id", "my-name");
    			attr_dev(h1, "class", "svelte-q0r1mi");
    			add_location(h1, file$c, 39, 1, 905);
    			attr_dev(div0, "class", "summary svelte-q0r1mi");
    			add_location(div0, file$c, 40, 1, 935);
    			attr_dev(div1, "id", "header");
    			attr_dev(div1, "class", "svelte-q0r1mi");
    			add_location(div1, file$c, 38, 0, 886);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h1);
    			append_dev(div1, t1);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*summaryLines*/ 2) {
    				each_value = /*summaryLines*/ ctx[1];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$7(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$7(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	const name = "Ilavarasan";

    	const summaryLines = [
    		"Collaborative computer science engineering student with hands-on experience in cloud computing, open-source development, and mobile app development. Enthusiastic about emerging technologies and AI advancements."
    	];

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		
    	};

    	return [name, summaryLines];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { name: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get name() {
    		return this.$$.ctx[0];
    	}

    	set name(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.18.1 */
    const file$d = "src/App.svelte";

    function create_fragment$d(ctx) {
    	let main;
    	let t;
    	let current;
    	const header = new Header({ $$inline: true });
    	const body = new Body({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(header.$$.fragment);
    			t = space();
    			create_component(body.$$.fragment);
    			add_location(main, file$d, 5, 0, 138);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(header, main, null);
    			append_dev(main, t);
    			mount_component(body, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(body.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(body.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(header);
    			destroy_component(body);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
