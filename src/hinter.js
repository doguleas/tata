const Hinter = {
  _opts: {
    type: 'log',
    position: 'top-right',
    duration: 5000,
    progress: true,
    progressWidth: 100,
    holding: false,
    icon: true,
    closeBtn: true,
    show: 'fadeIn', // slideIn
    hide: 'fadeOut', // SlideOut
    onClick: null,
    onClose: null
  },
  hinters: [],
  _type2Icon(type) {
    switch (type) {
      case 'log':
        return 'textsms'
      case 'warn':
        return 'info_outline'
      case 'success':
        return 'check'
      case 'error':
        return 'block'
      default:
        return ''
    }
  },
  _render(title, text, opts) {
    const icon = Hinter._type2Icon(opts.type)
    const id = Hinter._randomId()
    const times = opts.duration / (1000 / 60)
    const ms = opts.duration / times
    Object.assign(opts, { reduceTimes: times, perReduceMs: ms })
    const hinter = {
      title,
      text,
      opts,
      id
    }
    Hinter.hinters.push(hinter)
    document.id = { width: 100 }
    const template = `
      <div class="hinter ${opts.position} ${opts.type}" id=${id}>
        <i class="hinter-icon material-icons">${icon}</i>
        <div class="hinter-body">
          <h4 class="hinter-title">${title}</h4>
          <p class="hinter-text">${text}</p>
        </div>
        ${opts.closeBtn
          ? '<button class="hinter-close material-icons">clear</button>'
          : ''}
        ${opts.progress ? '<div class="hinter-progress"></div>' : ''}
      </div>
    `
    document.body.insertAdjacentHTML('beforeend', template)
    !!opts.onClick && typeof opts.onClick === 'function' && opts.onClick()
    !!opts.onClose && typeof opts.onClose === 'function' && opts.onClose()
    opts.progress && !opts.holding
    requestAnimationFrame(Hinter._reduceProgress.bind(hinter, hinter.id))
  },
  log(title = '你好', text = '今天是' + new Date().toLocaleString(), opts = {}) {
    const _opts = Object.assign(Hinter._opts, opts, {
      type: 'log'
    })
    Hinter._render(title, text, _opts)
  },
  info(title = '你好', text = '今天是' + new Date().toLocaleString(), opts = {}) {
    const _opts = Object.assign(Hinter._opts, opts, {
      type: 'info'
    })
    Hinter._render(title, text, _opts)
  },
  warn(title = '你好', text = '今天是' + new Date().toLocaleString(), opts = {}) {
    const _opts = Object.assign(Hinter._opts, opts, {
      type: 'warn'
    })
    Hinter._render(title, text, _opts)
  },
  error(title = '你好', text = '今天是' + new Date().toLocaleString(), opts = {}) {
    const _opts = Object.assign(Hinter._opts, opts, {
      type: 'error'
    })
    Hinter._render(title, text, _opts)
  },
  success(title = '你好', text = '今天是' + new Date().toLocaleString(), opts = {}) {
    const _opts = Object.assign(Hinter._opts, opts, {
      type: 'success'
    })
    Hinter._render(title, text, _opts)
  },
  close(event) {
    const target = event.target
    if (target.classList.contains('hinter-close')) {
      const id = target.parentNode.getAttribute('id')
      const idx = Hinter.hinters.findIndex(hinter => id === hinter.id)
      hinter.hinters.splice(idx, 1)
      document.getElementById(id).style.display = 'none'
    }
  },
  clear() {
    Hinter.hinters.forEach(hinter => {
      document.getElementById(hinter.id).style.display = 'none'
    })
    Hinter.hinters.length = 0
  },
  _randomId() {
    return `Hinter${Date.now()}`
  },
  _reduceProgress() {
    const hinter = Hinter.hinters.find(hinter => hinter.id === arguments[0])
    const id = hinter.id
    const progress = document
      .getElementById(id)
      .querySelector('.hinter-progress')
    hinter.opts.progressWidth -= 100 / hinter.opts.reduceTimes
    hinter.opts.duration -= hinter.opts.perReduceMs

    progress.style.width = hinter.opts.progressWidth + '%'
    const cut = requestAnimationFrame(Hinter._reduceProgress.bind(hinter, id))
    if (hinter.opts.progressWidth <= 0) {
      document.getElementById(id).style.display = 'none'
      cancelAnimationFrame(cut)
    }
  }
}
document.addEventListener('click', Hinter.close)
