import Vue from 'vue'
import ElementUI from 'kyligence-kylin-ui'

export const download = {
  post (url, data) {
    const $form = document.createElement('form')
    $form.style.display = 'none'
    $form.method = 'POST'
    $form.action = url
    $form.target = '_blank'
    $form.enctype = 'application/x-www-form-urlencoded'

    for (const [key, value] of Object.entries(data)) {
      if (value instanceof Array) {
        value.forEach((item, index) => {
          const $input = document.createElement('input')
          $input.name = `${key}[${index}]`
          $input.value = item
          $form.appendChild($input)
        })
      } else if (typeof value === 'object') {
        const $input = document.createElement('input')
        $input.name = key
        $input.value = JSON.stringify($input.value)
        $form.appendChild($input)
      } else {
        const $input = document.createElement('input')
        $input.name = key
        $input.value = value
        $form.appendChild($input)
      }
    }

    document.body.appendChild($form)
    $form.submit()

    setTimeout(() => {
      document.body.removeChild($form)
    })
  }
}

export function createToolTipDom (el, options = {}, className) {
  const customLayout = document.createElement('span')
  const renderer = Vue.compile(el)

  className && (customLayout.className += ` ${className}`)
  
  let createCommonTip = (propsData) => {
    let Dom = Vue.extend(ElementUI.Tooltip)
    // let Dom = Vue.extend(commonTip)
    return new Dom({
      propsData
    })
  }
  let t = createCommonTip({
    placement: options.position ?? 'top',
    effect: 'dark',
    visibleArrow: options['visible-arrow'] ?? true,
    content: options.text,
    popperClass: options['popper-class'] ?? ''
  })
  t.$slots.default = [t.$createElement(renderer)]
  t.$mount()
  customLayout.appendChild(t.$el)
  if (Array.isArray(options.children)) {
    options.children.forEach(item => {
      customLayout.appendChild(item)
    })
  } else {
    options.children && customLayout.appendChild(options.children)
  }
  customLayout.className = `${customLayout.className} ${options.className || ''}`
  return customLayout
}
