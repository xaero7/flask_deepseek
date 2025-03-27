// 注册Python语法高亮
hljs.registerLanguage('python', function(hljs) {
    const PYTHON_KEYWORDS = {
        keyword: 'and del from not while as elif global or with assert else if pass yield ' +
                'break except import print class exec in raise continue finally is return ' +
                'def for lambda try',
        built_in: 'abs all any bin bool chr complex dict dir divmod enumerate float ' +
                'format frozenset getattr globals hasattr hash help hex id input int ' +
                'isinstance issubclass iter len list locals map max min next object oct ' +
                'open ord pow property range repr reversed round set setattr slice sorted ' +
                'staticmethod str sum super tuple type vars zip',
        literal: 'True False None'
    };
    
    return {
        name: 'Python',
        keywords: PYTHON_KEYWORDS,
        contains: [
            hljs.QUOTE_STRING_MODE,
            hljs.APOS_STRING_MODE,
            hljs.NUMBER_MODE,
            {
                className: 'comment',
                begin: '#', end: '$'
            }
        ]
    };
});

// 注册C++语法高亮
hljs.registerLanguage('cpp', function(hljs) {
    const CPP_KEYWORDS = {
        keyword: 'alignas alignof and and_eq asm auto bitand bitor bool break case catch ' +
                'char char8_t char16_t char32_t class compl concept const consteval constexpr ' +
                'const_cast continue co_await co_return co_yield decltype default delete ' +
                'do double dynamic_cast else enum explicit export extern false float for ' +
                'friend goto if inline int long mutable namespace new noexcept not not_eq ' +
                'nullptr operator or or_eq private protected public register reinterpret_cast ' +
                'requires return short signed sizeof static static_assert static_cast struct ' +
                'switch template this thread_local throw true try typedef typeid typename ' +
                'union unsigned using virtual void volatile wchar_t while xor xor_eq',
        built_in: 'std string vector map set unordered_map unordered_set cout cin endl'
    };
    
    return {
        name: 'C++',
        keywords: CPP_KEYWORDS,
        contains: [
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE,
            hljs.QUOTE_STRING_MODE,
            hljs.NUMBER_MODE,
            { 
                begin: '\\b(vector|string|map|set)\\s*<', 
                end: '>', 
                keywords: 'vector string map set' 
            }
        ]
    };
});

// 初始化高亮
hljs.highlightAll();