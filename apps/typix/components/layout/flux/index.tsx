import { source } from '@/lib/source';
import { getSidebarTabs } from 'fumadocs-ui/components/sidebar/tabs/index';
import type { ReactNode } from 'react';
import { LayoutClient } from './client';
import { linkItems } from '../header';
import { baseOptions } from '@/lib/layout.shared';
import { TypixLogo } from '@/components/logo';

export function FluxLayout({ children }: { children: ReactNode }) {
    const base = baseOptions();

    return (
        <LayoutClient
            {...base}
            tree={source.getPageTree()}
            // just icon items
            links={linkItems.filter((item) => item.type === 'icon')}
            nav={{
                ...base.nav,
                title: (
                    <>
                        <TypixLogo className="size-7 invert dark:invert-0" />
                        <span className="font-medium in-[.uwu]:hidden max-md:hidden">Typix</span>
                    </>
                ),
            }}
            sidebar={{
                tabs: getSidebarTabs(source.getPageTree(), {
                    transform(option, node) {
                        const meta = source.getNodeMeta(node);
                        if (!meta || !node.icon) return option; 

                        return {
                            ...option,
                            icon: (
                                <div
                                    className="[&_svg]:size-full size-full text-(--tab-color)"
                                >
                                    {node.icon}
                                </div>
                            ),
                        };
                    },
                }),
            }}
        >
            {children}
        </LayoutClient>
    );
}