# Local development

Make sure you have the server running from the `../server` folder and then run the client

### Server

- run `npm install`
- run `npm run api`

### Client

from the root of the `/client` folder:

- run `npm install` 
- run `npm run dev`

# Tools and Approach

I tried to keep things simple. I feel like many times engineers tend to over-engineer solutions, pick too many tools, or over-complicate the code and fall into a over-engineering issue.
With that in mind, these are the tools I used:

- Vite to run the react app: it's simple, fast, reliable, and lean. My go-to is usually Next.js but the scope didn't require SSR, middleware tweaks, or other things that makes Next more valuable right off-the-bat.
- utility: date-fns a lightweight layer to handle date formating, and we can avoid reinventing the wheel
- CSS imports: although I've used many times CSS-in-JS solutions, I usually prefer to start as light as possible and then bring tools if they solve a pain. Based on the scope, it didn't feel we needed more.
- radix-theme: this one is what WorkOS uses, since the team uses I found that it was a good idea to test and learn it - it also matches with the Figma designs
- react-query: not reinveting the wheel and relying on a popular efficient solution helps the project to become more reliable and smart API integration

I defaulted to radix-theme the best I could. I love the idea of consistency and leveraging a Design system tool so the UX/UI is the the closest possible across an app.
If something was slightly ambiguous I went with radix-theme. Given the flex nature of the DS and best practices, I favored keeping the spacing config in the components instead of creating my own in CSS (avoided my own margins, paddings, etc).

- Radix-theme gives us great a11y support. I didn't notice anything that should be tweaked on that subject. - Maybe a deeper audit or added eslint could be a long-term vision improvement.
- Due to my lack of experience with radix-theme I might have made some uncommon decisions in some places but overall it was a great dev experience for me and it was nice to learn.
- I replicated the table menu style from the user table in Figma to the Roles tab.
- For the roles table still; it's pretty standard to use icons for boolean values, so I did that too.

# Improvements

Given the time contrainsts I didn't finish all of my ideas. Here are some I'd tackle with more time:

1. Search and pagination for the Roles table
2. URL based tabs: so users would have a shareable link that activates the a specific tab based on URL query params
3. Improve error communication with users
4. Improve the role edit form in general
