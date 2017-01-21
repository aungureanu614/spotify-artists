var React = require('react');
var TestUtils = require('react-addons-test-utils');
var should = require('chai').should();
var Hello = require('../js/components/Hello');



describe('React-Spotify', function() {


	it('renders Hello component', function() {
        var test = "Hello World";

        var renderer = TestUtils.createRenderer();
        renderer.render(<Hello test={test}/>);
        var result = renderer.getRenderOutput(); 

        result.type.should.equal('div');
        result.props.children.should.equal(test);
        

    });

});