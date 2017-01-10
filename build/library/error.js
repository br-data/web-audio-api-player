var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (dependencies, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    }
})(["require", "exports"], function (require, exports) {
    "use strict";
    // https://github.com/Microsoft/TypeScript/issues/12123
    var PlayerError = (function (_super) {
        __extends(PlayerError, _super);
        function PlayerError(message, code) {
            var _this = _super.call(this, message) || this;
            _this.code = code || null;
            // Set the prototype explictilly
            Object.setPrototypeOf(_this, PlayerError.prototype);
            return _this;
        }
        return PlayerError;
    }(Error));
    exports.PlayerError = PlayerError;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9idWlsZC9zb3VyY2UvbGlicmFyeS9lcnJvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztJQUtBLHVEQUF1RDtJQUN2RDtRQUFpQywrQkFBSztRQUlsQyxxQkFBWSxPQUFlLEVBQUUsSUFBYTtZQUExQyxZQUVJLGtCQUFNLE9BQU8sQ0FBQyxTQU9qQjtZQUxHLEtBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxJQUFJLElBQUksQ0FBQztZQUV6QixnQ0FBZ0M7WUFDaEMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFJLEVBQUUsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDOztRQUV2RCxDQUFDO1FBRUwsa0JBQUM7SUFBRCxDQWZBLEFBZUMsQ0FmZ0MsS0FBSyxHQWVyQztJQWZZLGtDQUFXIiwiZmlsZSI6ImxpYnJhcnkvZXJyb3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmV4cG9ydCBpbnRlcmZhY2UgSVBsYXllckVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIGNvZGU6IG51bWJlciB8IG51bGw7XG59XG5cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMTIxMjNcbmV4cG9ydCBjbGFzcyBQbGF5ZXJFcnJvciBleHRlbmRzIEVycm9yIHtcblxuICAgIHB1YmxpYyBjb2RlOiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlOiBzdHJpbmcsIGNvZGU/OiBudW1iZXIpIHtcblxuICAgICAgICBzdXBlcihtZXNzYWdlKTtcblxuICAgICAgICB0aGlzLmNvZGUgPSBjb2RlIHx8IG51bGw7XG5cbiAgICAgICAgLy8gU2V0IHRoZSBwcm90b3R5cGUgZXhwbGljdGlsbHlcbiAgICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKHRoaXMsIFBsYXllckVycm9yLnByb3RvdHlwZSk7XG5cbiAgICB9XG5cbn1cbiJdfQ==
