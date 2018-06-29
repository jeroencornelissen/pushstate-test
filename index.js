import Component from "can-component";
import route from "can-route-pushstate";
import "can-stache-route-helpers";

Component.extend({
  tag: "my-app",
  view: `
        {{#switch(page)}}
            {{#case("home")}}
                <h1>Home Page</h1>
                <a href="{{routeUrl(page='products')}}">Products</a>
            {{/case}}
            {{#case("products")}}
                <h1>Products</h1>
                <ul>
                <li><a href="{{routeUrl(page='home')}}">🏠 Home</a></li>
                <li><a href="{{routeUrl(page="products" subpage='banana')}}">🍌 banana</a></li>
                  <li><a href="{{routeUrl(page="products" subpage='kiwi')}}">🥝 kiwi</a></li>
                </ul>
                {{#switch(subpage)}}
                {{#case('kiwi')}}<h2>🥝🥝🥝</h2><a href="{{routeUrl(page='products')}}">Products</a>{{/case}}
                  {{#case('banana')}}<h2>🍌🍌🍌</h2><a href="{{routeUrl(page='products')}}">Products</a>{{/case}}
                  {{#default()}}<h2>🙊🙈🙉</h2><p>select a product</p>{{/default}}
                {{/switch}}
            {{/case}}
            {{#default()}}
                <h1>Page Not Found</h1>
                <a href="{{routeUrl(page='home')}}">🏠 Home routUrl</a>
                <a href="javascript://" on:click="routeTo('home')">🏠 Home onclick</a>
            {{/default}}
        {{/switch}}
        `,
  ViewModel: {
    page: "string",
    subpage: "string",

    routeTo(value) {
      route.data.page = value;
    }
  }
});

route.bindings.pushstate.root = "/test/";
route.register("{page}");
// route.register('{page}', { page: 'home' });
route.register("{page}/{subpage}");
route.data = document.querySelector("my-app");
route.start();
window.rt = route;
