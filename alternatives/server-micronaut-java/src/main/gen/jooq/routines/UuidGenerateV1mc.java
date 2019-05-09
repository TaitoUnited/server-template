/*
 * This file is generated by jOOQ.
 */
package jooq.routines;


import java.util.UUID;

import javax.annotation.Generated;

import jooq.Public;

import org.jooq.Parameter;
import org.jooq.impl.AbstractRoutine;
import org.jooq.impl.Internal;


/**
 * This class is generated by jOOQ.
 */
@Generated(
    value = {
        "http://www.jooq.org",
        "jOOQ version:3.11.11"
    },
    comments = "This class is generated by jOOQ"
)
@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class UuidGenerateV1mc extends AbstractRoutine<UUID> {

    private static final long serialVersionUID = 1569569674;

    /**
     * The parameter <code>public.uuid_generate_v1mc.RETURN_VALUE</code>.
     */
    public static final Parameter<UUID> RETURN_VALUE = Internal.createParameter("RETURN_VALUE", org.jooq.impl.SQLDataType.UUID, false, false);

    /**
     * Create a new routine call instance
     */
    public UuidGenerateV1mc() {
        super("uuid_generate_v1mc", Public.PUBLIC, org.jooq.impl.SQLDataType.UUID);

        setReturnParameter(RETURN_VALUE);
    }
}
