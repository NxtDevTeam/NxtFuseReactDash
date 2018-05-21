import React from 'react';
import {FuseExample, FuseHighlight, FusePageSimple} from '@fuse';
import {Button, Icon, Typography} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles/index';
/* eslint import/no-webpack-loader-syntax: off */
/* eslint no-unused-vars: off */
const styles = theme => ({
    layoutRoot: {}
});

function Drawers({classes})
{
    return (

        <FusePageSimple
            classes={{
                root: classes.layoutRoot
            }}
            header={
                <div className="flex flex-1 items-center justify-between p-24">
                    <Typography variant="title">Drawer</Typography>
                    <Button
                        className="normal-case"
                        variant="raised"
                        component="a"
                        href="https://material-ui-next.com/demos/drawers"
                        target="_blank"
                    >
                        <Icon className="mr-4">link</Icon>
                        Reference
                    </Button>
                </div>
            }
            content={
                <div className="p-24 max-w-2xl mx-auto">
                    <Typography className="text-44 mt-32 mb-8" component="h1">Drawer</Typography>
                    <Typography className="mb-16" component="div">The <a href="https://material.io/design/components/navigation-drawer.html">Drawer</a> slides in from the side.
                        It is a common pattern found in Google apps and follows the keylines and metrics for lists.</Typography>
                    <Typography className="text-32 mt-32 mb-8" component="h2">Temporary drawer</Typography>
                    <Typography className="mb-16" component="div">Temporary navigation drawers can toggle open or closed. Closed by default, the drawer opens temporarily above all
                        other content until a section is selected.</Typography>
                    <Typography className="mb-16" component="div">The Drawer can be cancelled by clicking the overlay or pressing the Esc key.
                        It closes when an item is selected, handled by controlling the <code>open</code> prop.</Typography>
                    <FuseExample
                        className="my-24"
                        component={require('main/content/components/material-ui/material-ui-examples/drawers/TemporaryDrawer.js').default}
                        raw={require('!raw-loader!main/content/components/material-ui/material-ui-examples/drawers/TemporaryDrawer.js')}
                    />

                    <Typography className="text-32 mt-32 mb-8" component="h2">Swipeable Temporary drawer</Typography>
                    <Typography className="mb-16" component="div">You can make the drawer swipeable with the <code>SwipeableDrawer</code> component.</Typography>
                    <Typography className="mb-16" component="div">This component comes with a 2 kB gzipped payload overhead.
                        Some low-end mobile devices won&#39;t be able to follow the fingers at 60 FPS.
                        You can use the <code>disableBackdropTransition</code> property to help.</Typography>
                    <FuseExample
                        className="my-24"
                        component={require('main/content/components/material-ui/material-ui-examples/drawers/SwipeableTemporaryDrawer.js').default}
                        raw={require('!raw-loader!main/content/components/material-ui/material-ui-examples/drawers/SwipeableTemporaryDrawer.js')}
                    />

                    <Typography className="mb-16" component="div">We are using the following set of properties on this documentation website for optimal usability of the
                        component:</Typography>
                    <ul>
                        <li>iOS is hosted on high-end devices.
                            We can enable the backdrop transition without dropping frames.
                            The performance will be good enough.
                        </li>
                        <li>iOS has a &quot;swipe to go back&quot; feature that mess
                            with the discovery feature. We have to disable it.
                        </li>
                    </ul>

                    <FuseHighlight component="pre" className="language-jsx">
                        {`
const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

<SwipeableDrawer disableBackdropTransition={!iOS} disableDiscovery={iOS} />
`}
                    </FuseHighlight>
                    <Typography className="text-32 mt-32 mb-8" component="h2">Permanent drawer</Typography>
                    <Typography className="mb-16" component="div">Permanent navigation drawers are always visible and pinned to the left edge, at the same elevation as the content
                        or background. They cannot be closed.</Typography>
                    <Typography className="mb-16" component="div">Permanent navigation drawers are the <strong>recommended default for desktop</strong>.</Typography>
                    <Typography className="text-24 mt-32 mb-8" component="h3">Full-height navigation</Typography>
                    <Typography className="mb-16" component="div">Apps focused on information consumption that use a left-to-right hierarchy.</Typography>
                    <FuseExample
                        className="my-24"
                        component={require('main/content/components/material-ui/material-ui-examples/drawers/PermanentDrawer.js').default}
                        raw={require('!raw-loader!main/content/components/material-ui/material-ui-examples/drawers/PermanentDrawer.js')}
                    />

                    <Typography className="text-24 mt-32 mb-8" component="h3">Clipped under the app bar</Typography>
                    <Typography className="mb-16" component="div">Apps focused on productivity that require balance across the screen.</Typography>
                    <FuseExample
                        className="my-24"
                        component={require('main/content/components/material-ui/material-ui-examples/drawers/ClippedDrawer.js').default}
                        raw={require('!raw-loader!main/content/components/material-ui/material-ui-examples/drawers/ClippedDrawer.js')}
                    />

                    <Typography className="text-32 mt-32 mb-8" component="h2">Persistent drawer</Typography>
                    <Typography className="mb-16" component="div">Persistent navigation drawers can toggle open or closed.
                        The drawer sits on the same surface elevation as the content.
                        It is closed by default and opens by selecting the menu icon, and stays open until closed by the user.
                        The state of the drawer is remembered from action to action and session to session.</Typography>
                    <Typography className="mb-16" component="div">When the drawer is outside of the page grid and opens, the drawer forces other content to change size and adapt to
                        the smaller viewport.</Typography>
                    <Typography className="mb-16" component="div">Persistent navigation drawers are acceptable for all sizes larger than mobile.
                        They are not recommended for apps with multiple levels of hierarchy that require using an up arrow for navigation.</Typography>
                    <FuseExample
                        className="my-24"
                        component={require('main/content/components/material-ui/material-ui-examples/drawers/PersistentDrawer.js').default}
                        raw={require('!raw-loader!main/content/components/material-ui/material-ui-examples/drawers/PersistentDrawer.js')}
                    />

                    <Typography className="text-32 mt-32 mb-8" component="h2">Mini variant drawer</Typography>
                    <Typography className="mb-16" component="div">In this variation, the persistent navigation drawer changes its width.
                        Its resting state is as a mini-drawer at the same elevation as the content, clipped by the app bar.
                        When expanded, it appears as the standard persistent navigation drawer.</Typography>
                    <Typography className="mb-16" component="div">The mini variant is recommended for apps sections that need quick selection access alongside content.</Typography>
                    <FuseExample
                        className="my-24"
                        component={require('main/content/components/material-ui/material-ui-examples/drawers/MiniDrawer.js').default}
                        raw={require('!raw-loader!main/content/components/material-ui/material-ui-examples/drawers/MiniDrawer.js')}
                    />

                    <Typography className="text-32 mt-32 mb-8" component="h2">Responsive drawer</Typography>
                    <Typography className="mb-16" component="div">The <code>Hidden</code> responsive helper component allows showing different types of drawer depending on the
                        screen width.
                        A <code>temporary</code> drawer is shown for small screens while a <code>permanent</code> drawer is shown for wider screens.</Typography>
                    <FuseExample
                        className="my-24"
                        component={require('main/content/components/material-ui/material-ui-examples/drawers/ResponsiveDrawer.js').default}
                        raw={require('!raw-loader!main/content/components/material-ui/material-ui-examples/drawers/ResponsiveDrawer.js')}
                    />
                </div>
            }
        />

    );
}

export default withStyles(styles, {withTheme: true})(Drawers);
                        