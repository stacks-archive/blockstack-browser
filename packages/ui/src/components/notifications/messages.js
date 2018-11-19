import React from 'react'
import { Type } from '../typography'
import { Flex } from '../primitives'
import X from 'mdi-react/CloseIcon'
import { NotificationContext } from './index'
import { Transition } from 'react-spring'
import { Message, Button, Content } from './styles.js'

const Messages = ({ ...rest }) => (
  <NotificationContext.Consumer>
    {({ items, remove, leave, config, cancel, canClose, top }) => (
      <Transition
        native
        items={items}
        keys={(item) => item.key}
        from={{ opacity: 0, height: 0, life: 1 }}
        enter={{ opacity: 1, height: 'auto' }}
        leave={leave}
        onRest={remove}
        config={config}
      >
        {(item) => ({ ...props }) => (
          <Message style={props}>
            <Content canClose={canClose} top={top}>
              <Flex flexDirection="column" py={4}>
                {item.title ? (
                  <Type color="blue.dark" pb={2} fontWeight="bold">
                    {item.title}
                  </Type>
                ) : null}
                <Type color="blue.dark" fontWeight={'400'}>
                  {item.message}
                </Type>
              </Flex>
              {canClose && (
                <Button onClick={() => cancel(item)}>
                  <X size={18} />
                </Button>
              )}
            </Content>
          </Message>
        )}
      </Transition>
    )}
  </NotificationContext.Consumer>
)

export { Messages }
