/* -*- Mode: C++; tab-width: 8; indent-tabs-mode: nil; c-basic-offset: 4 -*-
 *
 * ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Mozilla Communicator client code, released
 * March 31, 1998.
 *
 * The Initial Developer of the Original Code is
 * Netscape Communications Corporation.
 * Portions created by the Initial Developer are Copyright (C) 1998
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either of the GNU General Public License Version 2 or later (the "GPL"),
 * or the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

#ifndef jsfun_h___
#define jsfun_h___
/*
 * JS function definitions.
 */
#include "jsprvtd.h"
#include "jspubtd.h"
#include "jsobj.h"
#include "jsatom.h"
#include "jsstr.h"

/*
 * The high two bits of JSFunction.flags encode whether the function is native
 * or interpreted, and if interpreted, what kind of optimized closure form (if
 * any) it might be.
 *
 *   00   not interpreted
 *   01   interpreted, neither flat nor null closure
 *   10   interpreted, flat closure
 *   11   interpreted, null closure
 *
 * FUN_FLAT_CLOSURE implies FUN_INTERPRETED and u.i.script->upvarsOffset != 0.
 * FUN_NULL_CLOSURE implies FUN_INTERPRETED and u.i.script->upvarsOffset == 0.
 *
 * FUN_INTERPRETED but not FUN_FLAT_CLOSURE and u.i.script->upvarsOffset != 0
 * is an Algol-like function expression or nested function, i.e., a function
 * that never escapes upward or downward (heapward), and is only ever called.
 *
 * Finally, FUN_INTERPRETED and u.i.script->upvarsOffset == 0 could be either
 * a non-closure (a global function definition, or any function that uses no
 * outer names), or a closure of an escaping function that uses outer names
 * whose values can't be snapshot (because the outer names could be reassigned
 * after the closure is formed, or because assignments could not be analyzed
 * due to with or eval).
 *
 * Such a hard-case function must use JSOP_NAME, etc., and reify outer function
 * activations' call objects, etc. if it's not a global function.
 *
 * NB: JSFUN_EXPR_CLOSURE reuses JSFUN_STUB_GSOPS, which is an API request flag
 * bit only, never stored in fun->flags.
 *
 * If we need more bits in the future, all flags for FUN_INTERPRETED functions
 * can move to u.i.script->flags. For now we use function flag bits to minimize
 * pointer-chasing.
 */
#define JSFUN_JOINABLE      0x0001  /* function is null closure that does not
                                       appear to call itself via its own name
                                       or arguments.callee */

#define JSFUN_EXPR_CLOSURE  0x1000  /* expression closure: function(x) x*x */
#define JSFUN_TRCINFO       0x2000  /* when set, u.n.trcinfo is non-null,
                                       JSFunctionSpec::call points to a
                                       JSNativeTraceInfo. */
#define JSFUN_INTERPRETED   0x4000  /* use u.i if kind >= this value else u.n */
#define JSFUN_FLAT_CLOSURE  0x8000  /* flag (aka "display") closure */
#define JSFUN_NULL_CLOSURE  0xc000  /* null closure entrains no scope chain */
#define JSFUN_KINDMASK      0xc000  /* encode interp vs. native and closure
                                       optimization level -- see above */

#define FUN_OBJECT(fun)      (static_cast<JSObject *>(fun))
#define FUN_KIND(fun)        ((fun)->flags & JSFUN_KINDMASK)
#define FUN_SET_KIND(fun,k)  ((fun)->flags = ((fun)->flags & ~JSFUN_KINDMASK) | (k))
#define FUN_INTERPRETED(fun) (FUN_KIND(fun) >= JSFUN_INTERPRETED)
#define FUN_FLAT_CLOSURE(fun)(FUN_KIND(fun) == JSFUN_FLAT_CLOSURE)
#define FUN_NULL_CLOSURE(fun)(FUN_KIND(fun) == JSFUN_NULL_CLOSURE)
#define FUN_SCRIPT(fun)      (FUN_INTERPRETED(fun) ? (fun)->u.i.script : NULL)
#define FUN_CLASP(fun)       (JS_ASSERT(!FUN_INTERPRETED(fun)),               \
                              fun->u.n.clasp)
#define FUN_TRCINFO(fun)     (JS_ASSERT(!FUN_INTERPRETED(fun)),               \
                              JS_ASSERT((fun)->flags & JSFUN_TRCINFO),        \
                              fun->u.n.trcinfo)

/*
 * Formal parameters, local variables, and upvars are stored in a shape tree
 * path with its latest node at fun->u.i.names. The addLocal, lookupLocal, and
 * getLocalNameArray methods abstract away this detail.
 *
 * The lastArg, lastVar, and lastUpvar JSFunction methods provide more direct
 * access to the shape path. These methods may be used to make a Shape::Range
 * for iterating over the relevant shapes from youngest to oldest (i.e., last
 * or right-most to first or left-most in source order).
 *
 * Sometimes iteration order must be from oldest to youngest, however. For such
 * cases, use getLocalNameArray. The RAII helper class js::AutoLocalNameArray,
 * defined in jscntxt.h, should be used where possible instead of direct calls
 * to getLocalNameArray.
 */
enum JSLocalKind {
    JSLOCAL_NONE,
    JSLOCAL_ARG,
    JSLOCAL_VAR,
    JSLOCAL_CONST,
    JSLOCAL_UPVAR
};

struct JSFunction : public JSObject
{
    uint16          nargs;        /* maximum number of specified arguments,
                                     reflected as f.length/f.arity */
    uint16          flags;        /* flags, see JSFUN_* below and in jsapi.h */
    union U {
        struct {
            js::Native  native;   /* native method pointer or null */
            js::Class   *clasp;   /* class of objects constructed
                                     by this function */
            JSNativeTraceInfo *trcinfo;
        } n;
        struct Scripted {
            uint16      nvars;    /* number of local variables */
            uint16      nupvars;  /* number of upvars (computable from script
                                     but here for faster access) */
            uint16       skipmin; /* net skip amount up (toward zero) from
                                     script->staticLevel to nearest upvar,
                                     including upvars in nested functions */
            JSPackedBool wrapper; /* true if this function is a wrapper that
                                     rewrites bytecode optimized for a function
                                     judged non-escaping by the compiler, which
                                     then escaped via the debugger or a rogue
                                     indirect eval; if true, then this function
                                     object's proto is the wrapped object */
            JSScript    *script;  /* interpreted bytecode descriptor or null */
            js::Shape   *names;   /* argument and variable names */
        } i;
    } u;
    JSAtom          *atom;        /* name for diagnostics and decompiling */

    bool optimizedClosure()  const { return FUN_KIND(this) > JSFUN_INTERPRETED; }
    bool needsWrapper()      const { return FUN_NULL_CLOSURE(this) && u.i.skipmin != 0; }
    bool isInterpreted()     const { return FUN_INTERPRETED(this); }
    bool isNative()          const { return !FUN_INTERPRETED(this); }
    bool isConstructor()     const { return flags & JSFUN_CONSTRUCTOR; }
    bool isHeavyweight()     const { return JSFUN_HEAVYWEIGHT_TEST(flags); }

    inline bool inStrictMode() const;

    uintN countVars() const {
        JS_ASSERT(FUN_INTERPRETED(this));
        return u.i.nvars;
    }

    /* uint16 representation bounds number of call object dynamic slots. */
    enum { MAX_ARGS_AND_VARS = 2 * ((1U << 16) - 1) };

    uintN countArgsAndVars() const {
        JS_ASSERT(FUN_INTERPRETED(this));
        return nargs + u.i.nvars;
    }

    uintN countLocalNames() const {
        JS_ASSERT(FUN_INTERPRETED(this));
        return countArgsAndVars() + u.i.nupvars;
    }

    bool hasLocalNames() const {
        JS_ASSERT(FUN_INTERPRETED(this));
        return countLocalNames() != 0;
    }

    int sharpSlotBase(JSContext *cx);

    uint32 countUpvarSlots() const;

    const js::Shape *lastArg() const;
    const js::Shape *lastVar() const;
    const js::Shape *lastUpvar() const { return u.i.names; }

    bool addLocal(JSContext *cx, JSAtom *atom, JSLocalKind kind);

    /*
     * Look up an argument or variable name returning its kind when found or
     * JSLOCAL_NONE when no such name exists. When indexp is not null and the
     * name exists, *indexp will receive the index of the corresponding
     * argument or variable.
     */
    JSLocalKind lookupLocal(JSContext *cx, JSAtom *atom, uintN *indexp);

    /*
     * Function and macros to work with local names as an array of words.
     * getLocalNameArray returns the array, or null if we are out of memory.
     * This function must be called only when fun->hasLocalNames().
     *
     * The supplied pool is used to allocate the returned array, so the caller
     * is obligated to mark and release to free it.
     *
     * The elements of the array with index less than fun->nargs correspond to
     * the names of function formal parameters. An index >= fun->nargs
     * addresses a var binding. Use JS_LOCAL_NAME_TO_ATOM to convert array's
     * element to an atom pointer. This pointer can be null when the element is
     * for a formal parameter corresponding to a destructuring pattern.
     *
     * If nameWord does not name a formal parameter, use JS_LOCAL_NAME_IS_CONST
     * to check if nameWord corresponds to the const declaration.
     */
    jsuword *getLocalNameArray(JSContext *cx, struct JSArenaPool *pool);

    void freezeLocalNames(JSContext *cx);

    /*
     * If fun's formal parameters include any duplicate names, return one
     * of them (chosen arbitrarily). If they are all unique, return NULL.
     */
    JSAtom *findDuplicateFormal() const;

#define JS_LOCAL_NAME_TO_ATOM(nameWord)  ((JSAtom *) ((nameWord) & ~(jsuword) 1))
#define JS_LOCAL_NAME_IS_CONST(nameWord) ((((nameWord) & (jsuword) 1)) != 0)

    bool mightEscape() const {
        return FUN_INTERPRETED(this) && (FUN_FLAT_CLOSURE(this) || u.i.nupvars == 0);
    }

    bool joinable() const {
        return flags & JSFUN_JOINABLE;
    }

    JSObject &compiledFunObj() {
        return *this;
    }

  private:
    /*
     * js_FunctionClass reserves two slots, which are free in JSObject::fslots
     * without requiring dslots allocation. Null closures that can be joined to
     * a compiler-created function object use the first one to hold a mutable
     * methodAtom() state variable, needed for correct foo.caller handling.
     */
    enum {
        METHOD_ATOM_SLOT  = JSSLOT_FUN_METHOD_ATOM
    };

  public:
    void setJoinable() {
        JS_ASSERT(FUN_INTERPRETED(this));
        fslots[METHOD_ATOM_SLOT].setNull();
        flags |= JSFUN_JOINABLE;
    }

    /*
     * Method name imputed from property uniquely assigned to or initialized,
     * where the function does not need to be cloned to carry a scope chain or
     * flattened upvars.
     */
    JSAtom *methodAtom() const {
        return (joinable() && fslots[METHOD_ATOM_SLOT].isString())
               ? STRING_TO_ATOM(fslots[METHOD_ATOM_SLOT].toString())
               : NULL;
    }

    void setMethodAtom(JSAtom *atom) {
        JS_ASSERT(joinable());
        fslots[METHOD_ATOM_SLOT].setString(ATOM_TO_STRING(atom));
    }

    js::Native maybeNative() const {
        return isInterpreted() ? NULL : u.n.native;
    }

    JSScript *script() const {
        JS_ASSERT(isInterpreted());
        return u.i.script;
    }

    /* Number of extra fixed function object slots besides JSSLOT_PRIVATE. */
    static const uint32 CLASS_RESERVED_SLOTS = JSObject::FUN_CLASS_RESERVED_SLOTS;
    static const uint32 FIRST_FREE_SLOT = JSSLOT_PRIVATE + CLASS_RESERVED_SLOTS + 1;
};

JS_STATIC_ASSERT(sizeof(JSFunction) % JS_GCTHING_ALIGN == 0);

/*
 * Trace-annotated native. This expands to a JSFunctionSpec initializer (like
 * JS_FN in jsapi.h). fastcall is a FastNative; trcinfo is a
 * JSNativeTraceInfo*.
 */
#ifdef JS_TRACER
/* MSVC demands the intermediate (void *) cast here. */
# define JS_TN(name,fastcall,nargs,flags,trcinfo)                             \
    JS_FN(name, JS_DATA_TO_FUNC_PTR(Native, trcinfo), nargs,                  \
          (flags) | JSFUN_STUB_GSOPS | JSFUN_TRCINFO)
#else
# define JS_TN(name,fastcall,nargs,flags,trcinfo)                             \
    JS_FN(name, fastcall, nargs, flags)
#endif

/*
 * NB: the Arguments classes are uninitialized internal classes that masquerade
 * (according to Object.prototype.toString.call(arguments)) as "Arguments",
 * while having Object.getPrototypeOf(arguments) === Object.prototype.
 *
 * WARNING (to alert embedders reading this private .h file): arguments objects
 * are *not* thread-safe and should not be used concurrently -- they should be
 * used by only one thread at a time, preferably by only one thread over their
 * lifetime (a JS worker that migrates from one OS thread to another but shares
 * nothing is ok).
 *
 * Yes, this is an incompatible change, which prefigures the impending move to
 * single-threaded objects and GC heaps.
 */
extern js::Class js_ArgumentsClass;

namespace js {

extern Class StrictArgumentsClass;

struct ArgumentsData {
    js::Value   callee;
    js::Value   slots[1];
};

}

inline bool
JSObject::isNormalArguments() const
{
    return getClass() == &js_ArgumentsClass;
}

inline bool
JSObject::isStrictArguments() const
{
    return getClass() == &js::StrictArgumentsClass;
}

inline bool
JSObject::isArguments() const
{
    return isNormalArguments() || isStrictArguments();
}

#define JS_ARGUMENTS_OBJECT_ON_TRACE ((void *)0xa126)

extern JS_PUBLIC_DATA(js::Class) js_CallClass;
extern JS_PUBLIC_DATA(js::Class) js_FunctionClass;
extern js::Class js_DeclEnvClass;

inline bool
JSObject::isCall() const
{
    return getClass() == &js_CallClass;
}

inline bool
JSObject::isFunction() const
{
    return getClass() == &js_FunctionClass;
}

inline JSFunction *
JSObject::getFunctionPrivate() const
{
    JS_ASSERT(isFunction());
    return reinterpret_cast<JSFunction *>(getPrivate());
}

namespace js {

/*
 * NB: jsapi.h and jsobj.h must be included before any call to this macro.
 */
#define VALUE_IS_FUNCTION(cx, v)                                              \
    (!JSVAL_IS_PRIMITIVE(v) && JSVAL_TO_OBJECT(v)->isFunction())

static JS_ALWAYS_INLINE bool
IsFunctionObject(const js::Value &v)
{
    return v.isObject() && v.toObject().isFunction();
}

static JS_ALWAYS_INLINE bool
IsFunctionObject(const js::Value &v, JSObject **funobj)
{
    return v.isObject() && (*funobj = &v.toObject())->isFunction();
}

static JS_ALWAYS_INLINE bool
IsFunctionObject(const js::Value &v, JSFunction **fun)
{
    JSObject *funobj;
    bool b = IsFunctionObject(v, &funobj);
    if (b)
        *fun = funobj->getFunctionPrivate();
    return b;
}

/*
 * Macro to access the private slot of the function object after the slot is
 * initialized.
 */
#define GET_FUNCTION_PRIVATE(cx, funobj)                                      \
    (JS_ASSERT((funobj)->isFunction()),                                       \
     (JSFunction *) (funobj)->getPrivate())

/*
 * Return true if this is a compiler-created internal function accessed by
 * its own object. Such a function object must not be accessible to script
 * or embedding code.
 */
inline bool
IsInternalFunctionObject(JSObject *funobj)
{
    JS_ASSERT(funobj->isFunction());
    JSFunction *fun = (JSFunction *) funobj->getPrivate();
    return funobj == fun && (fun->flags & JSFUN_LAMBDA) && !funobj->getParent();
}
    
/* Valueified JS_IsConstructing. */
static JS_ALWAYS_INLINE bool
IsConstructing(const Value *vp)
{
#ifdef DEBUG
    JSObject *callee = &JS_CALLEE(cx, vp).toObject();
    if (callee->isFunction()) {
        JSFunction *fun = callee->getFunctionPrivate();
        JS_ASSERT((fun->flags & JSFUN_CONSTRUCTOR) != 0);
    } else {
        JS_ASSERT(callee->getClass()->construct != NULL);
    }
#endif
    return vp[1].isMagic();
}

static JS_ALWAYS_INLINE bool
IsConstructing_PossiblyWithGivenThisObject(const Value *vp, JSObject **ctorThis)
{
#ifdef DEBUG
    JSObject *callee = &JS_CALLEE(cx, vp).toObject();
    if (callee->isFunction()) {
        JSFunction *fun = callee->getFunctionPrivate();
        JS_ASSERT((fun->flags & JSFUN_CONSTRUCTOR) != 0);
    } else {
        JS_ASSERT(callee->getClass()->construct != NULL);
    }
#endif
    bool isCtor = vp[1].isMagic();
    if (isCtor)
        *ctorThis = vp[1].getMagicObjectOrNullPayload();
    return isCtor;
}

} /* namespace js */

extern JSString *
fun_toStringHelper(JSContext *cx, JSObject *obj, uintN indent);

extern JSFunction *
js_NewFunction(JSContext *cx, JSObject *funobj, js::Native native, uintN nargs,
               uintN flags, JSObject *parent, JSAtom *atom);

extern JSObject *
js_InitFunctionClass(JSContext *cx, JSObject *obj);

extern JSObject *
js_InitArgumentsClass(JSContext *cx, JSObject *obj);

extern void
js_TraceFunction(JSTracer *trc, JSFunction *fun);

extern void
js_FinalizeFunction(JSContext *cx, JSFunction *fun);

extern JSObject * JS_FASTCALL
js_CloneFunctionObject(JSContext *cx, JSFunction *fun, JSObject *parent,
                       JSObject *proto);

inline JSObject *
CloneFunctionObject(JSContext *cx, JSFunction *fun, JSObject *parent)
{
    JS_ASSERT(parent);
    JSObject *proto;
    if (!js_GetClassPrototype(cx, parent, JSProto_Function, &proto))
        return NULL;
    return js_CloneFunctionObject(cx, fun, parent, proto);
}

extern JSObject * JS_FASTCALL
js_AllocFlatClosure(JSContext *cx, JSFunction *fun, JSObject *scopeChain);

extern JS_REQUIRES_STACK JSObject *
js_NewFlatClosure(JSContext *cx, JSFunction *fun);

extern JS_REQUIRES_STACK JSObject *
js_NewDebuggableFlatClosure(JSContext *cx, JSFunction *fun);

extern JSFunction *
js_DefineFunction(JSContext *cx, JSObject *obj, JSAtom *atom, js::Native native,
                  uintN nargs, uintN flags);

/*
 * Flags for js_ValueToFunction and js_ReportIsNotFunction.  We depend on the
 * fact that JSINVOKE_CONSTRUCT (aka JSFRAME_CONSTRUCTING) is 1, and test that
 * with #if/#error in jsfun.c.
 */
#define JSV2F_CONSTRUCT         JSINVOKE_CONSTRUCT
#define JSV2F_SEARCH_STACK      0x10000

extern JSFunction *
js_ValueToFunction(JSContext *cx, const js::Value *vp, uintN flags);

extern JSObject *
js_ValueToFunctionObject(JSContext *cx, js::Value *vp, uintN flags);

extern JSObject *
js_ValueToCallableObject(JSContext *cx, js::Value *vp, uintN flags);

extern void
js_ReportIsNotFunction(JSContext *cx, const js::Value *vp, uintN flags);

extern JSObject *
js_GetCallObject(JSContext *cx, JSStackFrame *fp);

extern JSObject * JS_FASTCALL
js_CreateCallObjectOnTrace(JSContext *cx, JSFunction *fun, JSObject *callee, JSObject *scopeChain);

extern void
js_PutCallObject(JSContext *cx, JSStackFrame *fp);

extern JSBool JS_FASTCALL
js_PutCallObjectOnTrace(JSContext *cx, JSObject *scopeChain, uint32 nargs,
                        js::Value *argv, uint32 nvars, js::Value *slots);

extern JSBool
js_GetCallArg(JSContext *cx, JSObject *obj, jsid id, js::Value *vp);

extern JSBool
js_GetCallVar(JSContext *cx, JSObject *obj, jsid id, js::Value *vp);

extern JSBool
SetCallArg(JSContext *cx, JSObject *obj, jsid id, js::Value *vp);

extern JSBool
SetCallVar(JSContext *cx, JSObject *obj, jsid id, js::Value *vp);

/*
 * Slower version of js_GetCallVar used when call_resolve detects an attempt to
 * leak an optimized closure via indirect or debugger eval.
 */
extern JSBool
js_GetCallVarChecked(JSContext *cx, JSObject *obj, jsid id, js::Value *vp);

extern JSBool
js_GetArgsValue(JSContext *cx, JSStackFrame *fp, js::Value *vp);

extern JSBool
js_GetArgsProperty(JSContext *cx, JSStackFrame *fp, jsid id, js::Value *vp);

/*
 * Get the arguments object for the given frame.  If the frame is strict mode
 * code, its current arguments will be copied into the arguments object.
 *
 * NB: Callers *must* get the arguments object before any parameters are
 *     mutated when the frame is strict mode code!  The emitter ensures this
 *     occurs for strict mode functions containing syntax which might mutate a
 *     named parameter by synthesizing an arguments access at the start of the
 *     function.
 */
extern JSObject *
js_GetArgsObject(JSContext *cx, JSStackFrame *fp);

extern void
js_PutArgsObject(JSContext *cx, JSStackFrame *fp);

inline bool
js_IsNamedLambda(JSFunction *fun) { return (fun->flags & JSFUN_LAMBDA) && fun->atom; }

/*
 * Maximum supported value of arguments.length. It bounds the maximum number of
 * arguments that can be supplied via the second (so-called |argArray|) param
 * to Function.prototype.apply. This value also bounds the number of elements
 * parsed in an array initialiser.
 *
 * The thread's stack is the limiting factor for this number. It is currently
 * 2MB, which fits a little less than 2^19 arguments (once the stack frame,
 * callstack, etc. are included). Pick a max args length that is a little less.
 */
const uint32 JS_ARGS_LENGTH_MAX = JS_BIT(19) - 1024;

/*
 * JSSLOT_ARGS_LENGTH stores ((argc << 1) | overwritten_flag) as an Int32
 * Value.  Thus (JS_ARGS_LENGTH_MAX << 1) | 1 must be less than JSVAL_INT_MAX.
 */
JS_STATIC_ASSERT(JS_ARGS_LENGTH_MAX <= JS_BIT(30));
JS_STATIC_ASSERT(((JS_ARGS_LENGTH_MAX << 1) | 1) <= JSVAL_INT_MAX);

extern JSBool
js_XDRFunctionObject(JSXDRState *xdr, JSObject **objp);

extern JSBool
js_fun_apply(JSContext *cx, uintN argc, js::Value *vp);

extern JSBool
js_fun_call(JSContext *cx, uintN argc, js::Value *vp);

#endif /* jsfun_h___ */
