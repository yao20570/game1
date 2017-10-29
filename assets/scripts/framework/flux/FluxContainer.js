/**
 * Created by on 2017/9/25.
 */

class FluxContainer{
    createFunctional(component, store){
        component.setState(store.getState());
        store.addListener((endingState) => {
            component.setState(endingState);
        });
    }
}

export default new FluxContainer();