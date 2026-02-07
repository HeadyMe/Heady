" heady.vim — Heady AI Assistant for Vim
" Requires: curl, json_decode (Vim 8.0+)

if exists('g:loaded_heady') | finish | endif
let g:loaded_heady = 1

let g:heady_api_endpoint = get(g:, 'heady_api_endpoint', 'http://localhost:3300')
let g:heady_mode = get(g:, 'heady_mode', 'hybrid')

function! s:HeadyChat(message, context) abort
  let l:payload = json_encode({
    \ 'message': a:message,
    \ 'context': 'vim_' . a:context,
    \ 'source': 'ide-vim',
    \ 'mode': g:heady_mode,
    \ 'history': []
    \ })
  let l:cmd = printf('curl -s -X POST -H "Content-Type: application/json" -d %s %s/api/buddy/chat',
    \ shellescape(l:payload), g:heady_api_endpoint)
  let l:result = system(l:cmd)
  try
    let l:data = json_decode(l:result)
    let l:reply = get(l:data, 'reply', get(l:data, 'message', 'No response'))
  catch
    let l:reply = 'Error: Could not parse response. Is HeadyManager running?'
  endtry
  call s:ShowResponse(l:reply)
endfunction

function! s:ShowResponse(text) abort
  let l:buf = bufnr('__Heady__', 1)
  execute 'sbuffer' l:buf
  setlocal buftype=nofile bufhidden=wipe noswapfile nowrap
  setlocal filetype=markdown
  call append(line('$'), ['', '--- Heady ---', ''] + split(a:text, "\n"))
  normal! G
endfunction

function! s:GetVisualSelection() abort
  let [l:lnum1, l:col1] = getpos("'<")[1:2]
  let [l:lnum2, l:col2] = getpos("'>")[1:2]
  let l:lines = getline(l:lnum1, l:lnum2)
  return join(l:lines, "\n")
endfunction

command! -nargs=1 HeadyChat call s:HeadyChat(<q-args>, 'chat')
command! -range HeadyExplain call s:HeadyChat('Explain this code:\n```\n' . s:GetVisualSelection() . '\n```', 'explain')
command! -range HeadyRefactor call s:HeadyChat('Refactor this code:\n```\n' . s:GetVisualSelection() . '\n```', 'refactor')
command! HeadyTests call s:HeadyChat('Generate tests for:\n```\n' . join(getline(1, min([line('$'), 200])), "\n") . '\n```', 'tests')
command! HeadyDocs call s:HeadyChat('Generate docs for:\n```\n' . join(getline(1, min([line('$'), 200])), "\n") . '\n```', 'docs')

command! HeadyHealth echo system(printf('curl -s %s/api/health', g:heady_api_endpoint))

" Keybindings
nnoremap <leader>hc :HeadyChat<Space>
vnoremap <leader>he :HeadyExplain<CR>
vnoremap <leader>hr :HeadyRefactor<CR>
nnoremap <leader>ht :HeadyTests<CR>
nnoremap <leader>hd :HeadyDocs<CR>
