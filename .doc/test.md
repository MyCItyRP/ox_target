# Test 

## In browser

Make the eye visible and display options
```javascript
window.dispatchEvent(
    new MessageEvent('message', {
        data: {
            event: 'visible',
            state: true
        }
    })
);
window.dispatchEvent(
    new MessageEvent('message', {
        data: {
            event: 'setTarget',
            options: {
                global: [
                    {
                        hide: false,
                        icon: 'fab fa-github',
                        label: 'GitHub',
                    },
                    {
                        hide: false,
                        icon: 'fab fa-github',
                        label: 'This is a very long item',
                    },
                    {
                        hide: false,
                        icon: 'fab fa-github',
                        label: 'This is a very very long item that should be displayed in a menu',
                    }
                ]
            }
        }
    })
);
```
